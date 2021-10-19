export default function PreviewCard({ image, title, description }) {
	return (
		<div className="card-footer text-muted">
			<img
				src={image}
				alt={title}
				className="card-img-top"
				style={{ maxWidth: '360px', maxHeight: '150px' }}
			/>
			<br />
			<div>
				<h5 className="card-subtitle mb-2 mt-2 text-muted app-text-truncate">
					{title}
				</h5>
				<p className="card-text app-text-truncate">{description}</p>
			</div>
		</div>
	);
}
