'use client'; // if using Next.js app directory

import { useEffect, useRef, useState } from 'react';

export default function CompInfoTabEditor({ initialTabs, onSaveAll }) {
    const [tabs, setTabs] = useState(initialTabs); // [{ name: 'Tab 1', info_text: {} }, ...]
    const [activeTab, setActiveTab] = useState(0);
    const editorsRef = useRef({}); // store EditorJS instances per tab
    const [editingTabNameIndex, setEditingTabNameIndex] = useState(null);

    // Initialize EditorJS for active tab only on client
    useEffect(() => {
        let editorInstance;

        const initEditor = async () => {
            const { default: EditorJS } = await import('@editorjs/editorjs');
            const { default: Header } = await import('@editorjs/header');
            const { default: List } = await import('@editorjs/list');
            const { default: Paragraph } = await import('@editorjs/paragraph');
            const { default: Marker } = await import('@editorjs/marker');
            const { default: Hyperlink } = await import('editorjs-hyperlink');
            const { default: SimpleImage } = await import('@editorjs/simple-image');

            editorInstance = new EditorJS({
                holder: `editorjs-${activeTab}`,
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true
                    },
                    list: { 
                        class: List,
                        inlineToolbar: true
                    },
                    marker: { 
                        class: Marker,
                        inlineToolbar: true
                    },
                    paragraph: { 
                        class: Paragraph,
                        inlineToolbar: true
                    },
                    hyperlink: { 
                        class: Hyperlink,
                        inlineToolbar: true
                    },
                    image: SimpleImage
                },
                data: tabs[activeTab]?.content || {},
                placeholder: 'Type here...',
                onChange: async () => {
                const savedData = await editorInstance.save();
                setTabs(prev => {
                    const updated = [...prev];
                    updated[activeTab] = { ...updated[activeTab], content: savedData };
                    return updated;
                });
                }
            });

            editorsRef.current[activeTab] = editorInstance;
        };

        initEditor();

        return () => {
        if (editorsRef.current[activeTab]) {
            editorsRef.current[activeTab].destroy();
            delete editorsRef.current[activeTab];
        }
        };
    }, [activeTab]);

    const addTab = () => {
        setTabs(prevTabs => [
            ...prevTabs,
            {
                name: `Tab mới ${prevTabs.length + 1}`,
                info_text: ""
            }
        ]);
    };

    const deleteTab = (id) => {
        setTabs((prev) => prev.filter((_, i) => i !== id));;
    }

    const handleSaveInfoTabs = (index, data) => {
        setTabs(prevTabs => {
            const updatedTabs = [...prevTabs];
            updatedTabs[index] = {
                ...updatedTabs[index],
                info_text: data, // update content
            };
            return updatedTabs;
        });
    };

    const handleSaveAll = () => {
        onSaveAll(tabs); // send data back to parent
    };

    const handleRenameTab = (index, newName) => {
        setTabs(prevTabs => {
            const updatedTabs = [...prevTabs];
            updatedTabs[index] = {
                ...updatedTabs[index],
                name: newName
            };
            return updatedTabs;
        });
    };

    return (
        <div>
            {/* Save button */}
            <button className='save-info-tabs' onClick={handleSaveAll}>
                Lưu thay đổi
            </button>

            {/* Tab buttons */}
                <div className='create-comp-tabs-container'>
                    {tabs.map((tab, index) => (
                        // <div key={index} className={`create-comp-tab comp-info-tab ${activeTab == index ? "open" : ""}`} onClick={() => setActiveTab(index)}>{tab.name}</div>
                        <div
                            key={index}
                            className={`create-comp-tab comp-info-tab ${activeTab === index ? "open" : ""}`}
                            onClick={() => setActiveTab(index)}
                            onDoubleClick={() => setEditingTabNameIndex(index)}
                        >
                            {editingTabNameIndex === index ? (
                                <input
                                    type="text"
                                    value={tab.name}
                                    autoFocus
                                    onChange={(e) => handleRenameTab(index, e.target.value)}
                                    onBlur={() => setEditingTabNameIndex(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") setEditingTabNameIndex(null);
                                    }}
                                />
                            ) : (
                                <>
                                <span>{tab.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={(e) => deleteTab(index)}><path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                                </>
                            )}
                        </div>
                    ))}
                    <div className={`create-comp-tab comp-info-tab`} onClick={addTab}>Thêm</div>
                </div>

            
            {/* Editor for active tab */}
            <div style={{ marginTop: '1em' }}>
                <div id={`editorjs-${activeTab}`} style={{ border: 'none', minHeight: '200px' }} />
            </div>
        </div>
    );
}