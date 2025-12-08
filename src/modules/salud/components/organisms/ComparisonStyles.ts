export const ComparisonStyles = `
  .tabs-content-container {
    min-height: 400px;
    overflow: visible;
    display: flex;
    flex-direction: column;
  }
  .comparison-scroll-container {
    overflow-x: auto;
    overflow-y: visible;
    width: 100%;
  }
  .sticky-col {
    position: sticky;
    left: 0;
    z-index: 15;
    background-color: hsl(var(--background));
    box-shadow: 2px 0 8px rgba(0,0,0,0.08);
  }
  .sticky-header th {
    position: sticky;
    top: 0;
    z-index: 20;
    background-color: hsl(var(--background));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    padding: 0; 
  }
  .corner-cell {
    z-index: 25 !important;
    background-color: hsl(var(--muted)) !important;
  }
  /* Condensed table styles */
  .condensed-table td, .condensed-table th {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
  .condensed-table .group-row td {
    padding: 0.5rem;
    font-size: 0.8125rem;
  }
`;
