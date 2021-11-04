import * as React from 'react';

export default function InfiniteScrollContainer({
	children,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isFetching,
	pageSize,
	Skeleton,
}) {
	const loadMoreButtonRef = React.useRef({});
	const rootMargin = '0px';
	const threshold = 0;

	React.useEffect(() => {
		if (!hasNextPage || isFetching) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach(
					(entry) =>
						entry.isIntersecting &&
						!isFetchingNextPage &&
						fetchNextPage()
				),
			{
				root: undefined,
				rootMargin,
				threshold,
			}
		);

		const el = loadMoreButtonRef && loadMoreButtonRef.current;

		if (!el) {
			return;
		}

		observer.observe(el);

		return () => {
			observer.unobserve(el);
		};
	}, [hasNextPage, fetchNextPage, isFetchingNextPage, isFetching]);

	return (
		<>
			{children}
			{isFetching || isFetchingNextPage ? (
				<>
					{Array.from({ length: pageSize }, (_, i) => {
						return <Skeleton key={`load-${i}`}></Skeleton>;
					})}
				</>
			) : null}
			<div ref={loadMoreButtonRef} />
		</>
	);
}
