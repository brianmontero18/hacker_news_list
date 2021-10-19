import { PreviewCard, StoryCard } from './components';
import { useStories } from './api';
import './App.css';

export default function App() {
	const storyList = useStories();

	return (
		<div className="app-container">
			<h2>Hacker News</h2>
			<div className="app-grid">
				{storyList.map(({ data, isFetching }, i) =>
					isFetching ? (
						<div key={`load-${i}`} className="app-skeleton"></div>
					) : (
						<StoryCard
							key={data.id}
							title={
								<>
									<span>{`${i + 1}. `}</span>
									<a href={data.url}>{data.title}</a>
								</>
							}
							subtitle={
								<>
									{`${data.score} ${
										data.score > 1 ? 'points' : 'point'
									} by `}
									<b>{data.by}</b>
									{` ${getDiffTime(data.time)}`}
								</>
							}
							footer={<PreviewCard {...data.preview} />}
						/>
					)
				)}
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
