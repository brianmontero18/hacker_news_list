export default function StoryCard({ title, subtitle, footer }) {
	return (
		<div className="card mb-3">
			<div className="card-body">
				<div className="app-text-truncate">{title}</div>
				<span className="blockquote-footer">{subtitle}</span>
			</div>
			{footer}
		</div>
	);
}
