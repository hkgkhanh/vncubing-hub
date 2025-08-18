"use client";

export default function PageNavigation({ pageData, onPageChange }) {
    const currentPage = parseInt(pageData.page);
    const totalPages = pageData.pageTotal;

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page); // your custom handler
    };

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);

        // Adjust if at the edges
        if (currentPage <= half + 1) {
            start = 2;
            end = Math.min(totalPages - 1, maxVisible);
        } else if (currentPage >= totalPages - half) {
            start = Math.max(2, totalPages - maxVisible + 1);
            end = totalPages - 1;
        }

        if (totalPages <= 1) return pages;

        // Always show first page
        pages.push(1);

        // Show ellipsis if needed before middle
        if (start > 2) {
            pages.push('...');
        }

        // Middle range
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Show ellipsis if needed after middle
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <div className="pagination-container">

            {pages.map((page, idx) =>
                page === '...' ? (
                    <span key={idx} className="px-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => goToPage(page)}
                        className={`pagination-button ${
                            page === currentPage ? 'current-page' : ''
                        }`}
                    >
                        {page}
                    </button>
                )
            )}
        </div>
    );
}