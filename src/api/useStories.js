import { useQuery, useQueries } from 'react-query';

const LINK_PREVIEW_KEY = 'b1b9077d02a33accdd1e11f8dec9902a';
const HACKER_NEWS_STORY_LIST_KEY = 'hacker_news_top_story_list_key';
const HACKER_NEWS_STORY_KEY = 'hacker_news_story_key';
const HACKER_NEWS_URL = 'https://hacker-news.firebaseio.com/v0';
const SHOW_STORIES_URL = `${HACKER_NEWS_URL}/beststories.json`;
const SHOW_ITEM_URL = `${HACKER_NEWS_URL}/item`;
const LINK_PREVIEW_URL = `http://api.linkpreview.net/?key=${LINK_PREVIEW_KEY}`;
const PAGE_SIZE = 8;
const emptyObject = {};

export default function useStories() {
	const { data: stories } = useQuery({
		queryKey: HACKER_NEWS_STORY_LIST_KEY,
		queryFn: queryStoryListFn,
		select: getStoriesList,
	});

	return useQueries((stories || []).map(handleStory));
}

async function queryStoryListFn() {
	return fetch(SHOW_STORIES_URL).then((res) => res.json());
}

function getStoriesList(res) {
	return res.slice(0, PAGE_SIZE);
}

function handleStory(story) {
	return {
		queryKey: [HACKER_NEWS_STORY_KEY, story],
		queryFn: async () => {
			const storyResp = await fetch(`${SHOW_ITEM_URL}/${story}.json`);
			const storyBody = await storyResp.json();

			const previewResp = await fetch(
				`${LINK_PREVIEW_URL}&q=${storyBody.url}`
			);
			const previewBody = await previewResp.json();

			return {
				...storyBody,
				preview: previewBody,
			};
		},
		placeholderData: emptyObject,
	};
}
