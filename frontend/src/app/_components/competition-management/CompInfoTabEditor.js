'use client';

import { useEffect, useRef, useState } from 'react';

export default function CompInfoTabEditor({ initialTabs, onSaveAll }) {
    const [tabs, setTabs] = useState(initialTabs); // [{ name: 'Tab 1', info_text: {} }, ...]
    const [activeTab, setActiveTab] = useState(0);
    const editorsRef = useRef({}); // store EditorJS instances per tab
    const [editingTabNameIndex, setEditingTabNameIndex] = useState(null);

    useEffect(() => {
        let editorInstance;

        const initEditor = async () => {
            const { default: EditorJS } = await import('@editorjs/editorjs');
            const { default: Header } = await import('@editorjs/header');
            const { default: List } = await import('@editorjs/list');
            const { default: Paragraph } = await import('@editorjs/paragraph');
            const { default: Marker } = await import('@editorjs/marker');
            const { default: Hyperlink } = await import('editorjs-hyperlink');

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
                    }
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

    const handleSaveInfoTabs = (index, data) => {
        setTabs(prevTabs => {
            const updatedTabs = [...prevTabs];
            updatedTabs[index] = {
                ...updatedTabs[index],
                info_text: data,
            };
            return updatedTabs;
        });
    };

    const handleSaveAll = () => {
        onSaveAll(tabs);
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
                                tab.name
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