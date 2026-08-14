def pagination_offset(page: int, page_size: int) -> int:
    if page < 1 or page_size < 1:
        raise ValueError("Page and page size must be positive.")
    return (page - 1) * page_size
