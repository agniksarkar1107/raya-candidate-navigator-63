
import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const SearchPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination className="my-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, i, array) => {
            // Add ellipsis where needed
            if (i > 0 && array[i - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => onPageChange(page)} 
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            }
            
            return (
              <PaginationItem key={page}>
                <PaginationLink 
                  onClick={() => onPageChange(page)} 
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })
        }
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPagination;
