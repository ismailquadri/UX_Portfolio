'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/lib/chat-seed';


const samplePrompt = ['Walk me through your design process', 'Show me your most impactful case study', 'How soon can you start?'];

const NEAR_BOTTOM_PX = 48;
const HISTORY_KEY = 'quadri-chat-history';
const MAX_HISTORY = 20;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error('Verification timed out. Please try again.')),
			timeoutMs,
		);
		promise.then(
			(value) => { clearTimeout(timer); resolve(value); },
			(error) => { clearTimeout(timer); reject(error); },
		);
	});
}

export default function ChatWidget() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isShowSamplePrompt, setIsShowSamplePrompt] = useState(false);
	const [error, setError] = useState('');
	const ref = useRef<TurnstileInstance | null>(null);

	// FIX: Ref for scrolling container
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const widgetRef = useRef<HTMLDivElement>(null);
	// While true, new/streaming messages keep the list pinned to the bottom.
	// Set false when the user scrolls away from the bottom, true again when
	// they return or send a message.
	const stickToBottomRef = useRef(true);
	const historyHydratedRef = useRef(false);
	// Streaming accumulates tokens across async chunks; keeping it in a ref
	// avoids reassigning a value React considers immutable during render.
	const fullAssistantReplyRef = useRef('');

	// Capture the wheel gesture whenever the cursor is over the chat widget so
	// the page behind doesn't scroll and the message list always responds,
	// even before it has enough content to scroll natively.
	useEffect(() => {
		const widget = widgetRef.current;
		if (!widget) return;

		function handleWheel(event: WheelEvent) {
			const list = scrollContainerRef.current;
			if (!list) return;
			event.preventDefault();
			// Lenis (site-wide smooth scroll) hijacks wheel events on window with
			// its own JS-driven scroll, so it doesn't respect preventDefault() on
			// a nested element. Stop the event from ever reaching Lenis's
			// listener — data-lenis-prevent below is the belt to this suspender.
			event.stopPropagation();
			list.scrollTop += event.deltaY;
			list.scrollLeft += event.deltaX;
			const distanceFromBottom =
				list.scrollHeight - list.scrollTop - list.clientHeight;
			stickToBottomRef.current = distanceFromBottom <= NEAR_BOTTOM_PX;
		}

		widget.addEventListener('wheel', handleWheel, { passive: false });
		return () => widget.removeEventListener('wheel', handleWheel);
	}, []);

	const handleSelectPrompt = (userPrompt: string) => {
		setIsShowSamplePrompt(true);
		void sendPromptToAi(userPrompt);
	};

	// Scroll the message list to the bottom (used on history load and when
	// following a streaming reply).
	const scrollToBottom = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	};

	useEffect(() => {
		try {
			const saved = localStorage.getItem(HISTORY_KEY);
			const history = saved ? (JSON.parse(saved) as ChatMessage[]) : [];
			if (Array.isArray(history)) {
				const cleanHistory = history.filter((message) =>
					(message.role === 'user' || message.role === 'assistant') &&
					typeof message.content === 'string' && typeof message.created_at === 'string'
				).slice(-MAX_HISTORY);
				requestAnimationFrame(() => {
					historyHydratedRef.current = true;
					setMessages(cleanHistory);
					setIsShowSamplePrompt(cleanHistory.length === 0);
					if (cleanHistory.length) scrollToBottom();
				});
			}
		} catch {
			localStorage.removeItem(HISTORY_KEY);
			requestAnimationFrame(() => {
				historyHydratedRef.current = true;
				setIsShowSamplePrompt(true);
			});
		}
	}, []);

	useEffect(() => {
		if (!historyHydratedRef.current) return;
		if (!isSending) localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
	}, [isSending, messages]);

	// FIX: Trigger scroll whenever messages update, but only while the user
	// hasn't scrolled away to read earlier messages — otherwise a streaming
	// reply would keep yanking them back to the bottom.
	useEffect(() => {
		if (!stickToBottomRef.current) return;
		scrollToBottom();
	}, [messages]);

	function formatMessageTime(isoString: string) {
		if (!isoString) return '';
		const date = new Date(isoString);
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	}

	async function sendPromptToAi(userPrompt: string) {
		if (isSending) return;
		stickToBottomRef.current = true;
		const userMessage: ChatMessage = {
			role: 'user', content: userPrompt, created_at: new Date().toISOString(),
		};
		const assistantMessage: ChatMessage = {
			role: 'assistant', content: '', created_at: new Date().toISOString(),
		};
		const promptMessages = [...messages, userMessage].slice(-MAX_HISTORY);
		if (promptMessages[0]?.role === 'assistant') promptMessages.shift();
		const nextMessages = [...promptMessages, assistantMessage];
		while (nextMessages.length > MAX_HISTORY) {
			nextMessages.shift();
			if (nextMessages[0]?.role === 'assistant') nextMessages.shift();
		}
		setMessages(nextMessages);
		setError('');
		setIsSending(true);
		setIsLoading(true);
		fullAssistantReplyRef.current = '';

		try {
			let turnstileToken: string | undefined;
			if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
				if (!ref.current) throw new Error('Security verification is not ready. Please try again.');
				ref.current.execute();
				turnstileToken = await withTimeout(ref.current.getResponsePromise(), 10_000);
			}

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: promptMessages.map(({ role, content }) => ({ role, content })),
					turnstileToken,
				}),
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null) as { error?: string } | null;
				throw new Error(body?.error === 'chat_unavailable'
					? 'Chat is temporarily unavailable. Please try again later.'
					: 'I could not send that message. Please try again.');
			}
			const reader = response.body?.getReader();
			if (!reader) throw new Error('Chat is temporarily unavailable. Please try again.');
			const decoder = new TextDecoder();
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				fullAssistantReplyRef.current += decoder.decode(value, { stream: true });
				const content = fullAssistantReplyRef.current;
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1] = { ...assistantMessage, content };
					return updated;
				});
			}
			const finalChunk = decoder.decode();
			if (finalChunk) {
				fullAssistantReplyRef.current += finalChunk;
				const content = fullAssistantReplyRef.current;
				setMessages((prev) => {
					const updated = [...prev];
					updated[updated.length - 1] = { ...assistantMessage, content };
					return updated;
				});
			}
			if (!fullAssistantReplyRef.current.trim()) throw new Error('I could not generate a reply. Please try again.');
			setIsShowSamplePrompt(false);
		} catch (caught: unknown) {
			console.error('Chat request failed:', caught);
			setError(caught instanceof Error && caught.message.includes('Verification')
				? caught.message
				: 'I could not send that message. Please try again.');
			setMessages((prev) => prev.filter((message) => message !== assistantMessage && message !== userMessage));
		} finally {
			ref.current?.reset();
			setIsLoading(false);
			setIsSending(false);
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const userPrompt = input.trim();
		if (!userPrompt || isSending) return;

		// FIX: Clear React input state immediately so the field clears on screen
		setInput('');
		event.currentTarget.reset();

		await sendPromptToAi(userPrompt);
	}

	return (
		<div
			id='chat'
			ref={widgetRef}
			data-lenis-prevent
			className='absolute inset-x-3 top-[53px] mx-auto flex h-[641px] max-w-[420px] items-center gap-2.5 rounded-lg bg-paper/40 p-3 backdrop-blur-md'
		>
			<div className='flex h-full w-full flex-col items-center justify-end rounded-md border border-paper bg-paper/[0.79] p-2.5'>
				{/* Header */}
				<div className='flex shrink-0 flex-col items-center justify-center gap-2.5'>
					<span className='relative block size-[50px] shrink-0 overflow-hidden rounded-full bg-border-subtle'>
						<Image
							src='/images/avatar.png'
							alt='Quadri Helper avatar'
							fill
							sizes='50px'
							className='object-cover'
						/>
					</span>
					{messages?.length > 1 || !isShowSamplePrompt ? null : (
						<p className='font-body text-[16px] tracking-[-0.16px] text-ink'>
							Quadri Helper
						</p>
					)}
				</div>

				{/* Message list */}
				<div
					ref={scrollContainerRef}
					className='flex w-full flex-1 flex-col justify-start gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto py-12 px-2'
				>
					{messages?.map((message, idx) => {
						const isUser = message.role === 'user';
						return (
							<div
								key={message.created_at || idx}
								className={`flex w-full flex-col gap-1 ${
									isUser ? 'items-end' : 'items-start'
								}`}
							>
								<div
									className={`max-w-[80%] rounded-md px-4 py-3 font-body text-[16px] leading-[1.4] tracking-[-0.16px] ${
										isUser
											? 'bg-gradient-to-b from-[#454545] to-[#1d1d1d] text-paper/90'
											: 'bg-paper text-ink/90'
									}`}
								>
									{message.content === '' &&
									message.role === 'assistant' &&
									isLoading ? (
										<span className='flex items-center gap-2 text-ink/60'>
											<svg
												className='size-4 animate-spin-smooth'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<circle
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='3'
													strokeOpacity='0.25'
												/>
												<path
													d='M12 2C6.47715 2 2 6.47715 2 12'
													stroke='currentColor'
													strokeWidth='3'
													strokeLinecap='round'
												/>
											</svg>
											<span className='text-[14px] italic'>Thinking...</span>
										</span>
									) : message.role === 'assistant' ? (
										<ReactMarkdown>{message.content}</ReactMarkdown>
									) : (
										<p>{message.content}</p>
									)}
								</div>
								<p
									className={`font-body text-[12px] font-medium tracking-[-0.24px] text-ink/50 ${
										isUser ? 'text-right' : 'text-left'
									}`}
								>
									{formatMessageTime(message.created_at)}
								</p>
							</div>
						);
					})}
				</div>

				{messages?.length > 1 || !isShowSamplePrompt ? null : (
					<div className='flex w-full shrink-0 flex-wrap items-center justify-center gap-2 pb-1'>
						{samplePrompt.map((prompt) => (
							<button
								onClick={() => handleSelectPrompt(prompt)}
								disabled={isLoading}
								className='cursor-pointer rounded-full border border-border-subtle bg-paper px-3 py-1.5 font-body text-[13px] font-medium tracking-[-0.13px] text-ink shadow-button transition-colors hover:bg-surface disabled:opacity-60'
								key={prompt}
								type='button'
							>
								{prompt}
							</button>
						))}
					</div>
				)}

				{error ? (
					<p className='w-full shrink-0 px-1 font-body text-[13px] leading-snug text-[#b3261e]'>
						{error}
					</p>
				) : null}

				{/* Input row */}
				<form
					onSubmit={handleSubmit}
					className='flex h-10 w-full shrink-0 items-center gap-2.5 rounded-full border border-paper bg-paper py-1 pl-3 pr-1 shadow-button'
				>
				

					<input
						type='text'
						name='message'
						maxLength={2_000}
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder='Send us message'
						disabled={isSending}
						className='min-w-0 flex-1 bg-transparent font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/40 disabled:opacity-60'
					/>

					<Turnstile
						siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
						options={{
							execution: 'execute',
							appearance: 'interaction-only',
						}}
						ref={ref}
					/>
					<button
						type='submit'
						aria-label='Send message'
						disabled={isSending || input.length < 1}
						className='flex size-8 shrink-0 items-center justify-center rounded-full border border-[#353535] bg-gradient-to-b from-black to-[#666] disabled:opacity-60'
					>
						<svg
							width='18'
							height='18'
							viewBox='0 0 18 18'
							fill='none'
							className='rotate-180 scale-y-[-1]'
							aria-hidden='true'
						>
							<path
								d='M4.5 4.5H13.5V13.5'
								stroke='white'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M13.5 4.5L4.5 13.5'
								stroke='white'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
				</form>
			</div>
		</div>
	);
}
