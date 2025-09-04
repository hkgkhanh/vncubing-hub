"use client";

import React, { useEffect, useRef } from 'react';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export default function CompInfoTab({ slug, data }) {
    const viewerRef = useRef(null);

    useEffect(() => {
        if (viewerRef.current) {
            const viewer = new Viewer({
                el: viewerRef.current,
                height: 'auto',
                initialValue: data
            });

            return () => {
                viewer.destroy();
            };
        }
    }, [data]); 
        
    

    return (
        <div id={`viewer-${slug}`} ref={viewerRef}></div>
    );
}