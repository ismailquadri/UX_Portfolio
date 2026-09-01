'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { getOrCreateSession } from '@/utils/get-or-create-session';
import { api } from '@/lib/axios-instance';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/chat-seed'; // Adjust path if needed


const samplePrompt = ['Walk me through your design process', 'Show me your most impactful case study', 'How soon can you start?'];

const NEAR_BOTTOM_PX = 48;

export default function ChatWidget() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [sendType, setSendType] = useState('')
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

	const handleSelectPrompt = async (userPrompt: string) => {
		

					setIsLoading(true);
		try {
			// FIX: Ensure session is fully resolved and active BEFORE getting the token
			await getOrCreateSession(ref, setError);
			const activeSessionId = localStorage.getItem('anonymous_session_token');

			if (!activeSessionId) {
				throw new Error('Session could not be established.');
			}
			setIsShowSamplePrompt(true)
      
			setIsLoading(true);
			await sendPromptToAi(userPrompt, activeSessionId);
	

			setIsShowSamplePrompt(false)
		} catch (error: unknown) {
			console.error('Submission error:', error);
			const message =
				typeof error === 'string'
					? error
					: error instanceof Error
					? error.message
					: 'Something went wrong.';
			setError(message);
      setIsShowSamplePrompt(true)
			// Handle 401 Unauthorized token expiry gracefully and retry once
			if (
				typeof error === 'object' &&
				error !== null &&
				'response' in error &&
				(error as { response?: { status?: number } }).response?.status === 401
			) {
				setIsShowSamplePrompt(true)
				localStorage.removeItem('anonymous_session_token');
				await getOrCreateSession(ref, setError);
				const refreshedSessionId = localStorage.getItem(
					'anonymous_session_token',
				);
				if (refreshedSessionId) {
					await sendPromptToAi(userPrompt, refreshedSessionId);
				}
			}
		} 
	}

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
		async function getMessages() {
			const session_id = localStorage.getItem('anonymous_session_token');

			if (!session_id) {
					setIsShowSamplePrompt(true)
				return;
			}
			try {
				const response = await api.get(`/chat/history/${session_id}`);
				const history = response.data?.history || [];
				setMessages(history);

				if (history.length < 1) {
					setIsShowSamplePrompt(true);
				} else {
					// Jump to the latest message when a session's history loads.
					stickToBottomRef.current = true;
					requestAnimationFrame(() => scrollToBottom());
				}
			} catch (err) {
				console.error('Failed to load history', err);
			}
		}

		getMessages();
	}, []);

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

	async function sendPromptToAi(userPrompt: string, sessionToken: string) {
		stickToBottomRef.current = true;
		setMessages((prev) => [
			...prev,
			{
				role: 'user',
				content: userPrompt,
				created_at: new Date().toISOString(),
			},
			{ role: 'assistant', content: '', created_at: new Date().toISOString() },
		]);
		setIsSending(true);
		setIsLoading(true);

		try {
			// FIX: was hardcoded to http://localhost:8000/prompt, which only
			// resolves on the developer's own machine — every other visitor's
			// browser would try to hit their own localhost and fail silently.
			// Use the same env-configured API base as the rest of the app.
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompt`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionToken}`,
				},
				body: JSON.stringify({ prompt: userPrompt }),
			});

			if (!response.ok) {
				throw new Error('Failed to stream response from server.');
			}

			const reader = response.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();
			fullAssistantReplyRef.current = '';

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				const chunkText = decoder.decode(value, { stream: true });
				const lines = chunkText.split('\n\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const jsonString = line.replace('data: ', '').trim();

						if (jsonString === '[DONE]') {
							setIsLoading(false);
							setIsSending(false);
							return;
						}

						try {
							const parsed = JSON.parse(jsonString) as {
								token?: string;
								error?: string;
							};

							if (parsed?.token) {
								fullAssistantReplyRef.current += parsed.token;
								const content = fullAssistantReplyRef.current;
								setMessages((prev) => {
									const newMessages = [...prev];
									newMessages[newMessages.length - 1] = {
										role: 'assistant',
										content,
										created_at: new Date().toISOString(),
									};
									return newMessages;
								});
							}

							if (parsed?.error) {
								console.error('Stream reported error:', parsed.error);
							}
						} catch {
							// Ignore incomplete chunks across buffers
						}
					}
				}
			}
		} catch (error: unknown) {
			console.error('Network or stream error:', error);
		} finally {
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

		try {
			// FIX: Ensure session is fully resolved and active BEFORE getting the token
			await getOrCreateSession(ref, setError);
			const activeSessionId = localStorage.getItem('anonymous_session_token');

			if (!activeSessionId) {
				throw new Error('Session could not be established.');
			}

			await sendPromptToAi(userPrompt, activeSessionId);
		} catch (error: unknown) {
			console.error('Submission error:', error);
			setError(
				typeof error === 'string'
					? error
					: error instanceof Error
					? error.message
					: 'Something went wrong.',
			);

			// Handle 401 Unauthorized token expiry gracefully and retry once
			if (
				typeof error === 'object' &&
				error !== null &&
				'response' in error &&
				(error as { response?: { status?: number } }).response?.status === 401
			) {
				localStorage.removeItem('anonymous_session_token');
				await getOrCreateSession(ref, setError);
				const refreshedSessionId = localStorage.getItem(
					'anonymous_session_token',
				);
				if (refreshedSessionId) {
					await sendPromptToAi(userPrompt, refreshedSessionId);
				}
			}
		}
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
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder='Send us message'
						disabled={isSending}
						className='min-w-0 flex-1 bg-transparent font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/40 disabled:opacity-60'
					/>

					<Turnstile
						siteKey='0x4AAAAAAEVSDbLmpQVNuy4H'
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
