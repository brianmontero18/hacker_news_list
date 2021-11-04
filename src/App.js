import * as React from 'react';
import {
	PreviewCard,
	StoryCard,
	InfiniteScrollContainer,
	SkeletonCard,
} from './components';
import { useStories, STORY_PAGE_SIZE } from './api';
import './App.css';

export default function App() {
	const { data, ...rest } = useStories();

	return (
		<div className="app-container">
			<h2>Hacker News</h2>
			<div className="app-grid">
				<InfiniteScrollContainer
					Skeleton={SkeletonCard}
					pageSize={STORY_PAGE_SIZE}
					{...rest}
				>
					{data.map((page, pageIndex) => (
						<React.Fragment key={`page-${pageIndex}`}>
							{page.map((story, storyIndex) => (
								<StoryCard
									key={story.id}
									title={
										<>
											<span>{`${
												pageIndex * STORY_PAGE_SIZE +
												storyIndex +
												1
											}. `}</span>
											<a href={story.url}>
												{story.title}
											</a>
										</>
									}
									subtitle={
										<>
											{`${story.score} ${
												story.score > 1
													? 'points'
													: 'point'
											} by `}
											<b>{story.by}</b>
											{` ${getDiffTime(story.time)}`}
										</>
									}
									footer={<PreviewCard {...story.preview} />}
								/>
							))}
						</React.Fragment>
					))}
				</InfiniteScrollContainer>
			</div>
		</div>
	);
}

function getDiffTime(sourceTime) {
	const currentTime = Math.round(Date.now() / 1000);
	const diffTimeInSec = currentTime - sourceTime;
	let unit = 'sec';
	let diffTime;

	if (diffTimeInSec >= 60) {
		unit = 'min';
		diffTime = diffTimeInSec / 60;

		if (diffTime >= 60) {
			unit = 'hour';
			diffTime = diffTime / 60;
		}
	}

	return `${parseInt(diffTime)} ${unit}${diffTime > 1 ? 's' : ''} ago`;
}
