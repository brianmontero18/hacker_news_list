import * as React from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';

const LINK_PREVIEW_KEY = 'e514d3559aa28b2214c37b6c28f27559';
const HACKER_NEWS_STORY_LIST_KEY = 'hacker_news_top_story_list_key';
const HACKER_NEWS_STORY_KEY = 'hacker_news_story_key';
const HACKER_NEWS_URL = 'https://hacker-news.firebaseio.com/v0';
const SHOW_STORIES_URL = `${HACKER_NEWS_URL}/beststories.json`;
const SHOW_ITEM_URL = `${HACKER_NEWS_URL}/item`;
const LINK_PREVIEW_URL = 'https://api.linkpreview.net';
const emptyList = { pages: [] };

export const STORY_PAGE_SIZE = 8;

export function useStories() {
	const { data: stories } = useQuery({
		queryKey: HACKER_NEWS_STORY_LIST_KEY,
		queryFn: queryStoryListFn,
	});

	return useInfiniteQuery({
		placeholderData: emptyList,
		queryKey: [HACKER_NEWS_STORY_KEY],
		queryFn: React.useCallback(
			async ({ pageParam = [0, STORY_PAGE_SIZE] }) => {
				const dale = await Promise.allSettled(
					(stories || []).slice(...pageParam).map(async (story) => {
						const storyResp = await fetch(
							`${SHOW_ITEM_URL}/${story}.json`
						);
						const storyBody = await storyResp.json();
						const preview = await fetchLinkPreview(storyBody.url);

						return {
							...storyBody,
							preview,
						};
					})
				);

				return dale.map((a) => a.value);
			},
			[stories]
		),
		getNextPageParam: React.useCallback(
			(lastPage, allPages) => {
				if (stories.length === allPages.length) {
					return false;
				} else {
					return [
						allPages.length * STORY_PAGE_SIZE,
						allPages.length * STORY_PAGE_SIZE + STORY_PAGE_SIZE,
					];
				}
			},
			[stories]
		),
		select: getStoryData,
		enabled: Boolean(stories?.length),
	});
}

function getStoryData(response) {
	return response.pages;
}

async function fetchLinkPreview(url) {
	const previewResp = await fetch(LINK_PREVIEW_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `key=${LINK_PREVIEW_KEY}&q=${encodeURIComponent(url)}`,
	});
	const previewBody = await previewResp.json();

	return previewBody;
}

async function queryStoryListFn() {
	return fetch(SHOW_STORIES_URL).then((res) => res.json());
}
