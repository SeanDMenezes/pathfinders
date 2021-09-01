const reportWebVitals = onPerfEntry => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFCP(onPerfEntry);
            getFID(onPerfEntry);
            getTTFB(onPerfEntry);
            getLCP(onPerfEntry);
        });
    }
};

export default reportWebVitals;
