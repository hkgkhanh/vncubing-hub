'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@/app/_styles/lib/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

export default function CompInfoTabEditor({ initialTabs, onSaveAll }) {
    const [tabs, setTabs] = useState(initialTabs); // [{ name: 'Tab 1', info_text: {} }, ...]
    const [activeTab, setActiveTab] = useState(0);
    const editorsRef = useRef({}); // store Toast UI Editor instances per tab
    const [editingTabNameIndex, setEditingTabNameIndex] = useState(null);
    const [tempTabName, setTempTabName] = useState("");
    const [editorKey, setEditorKey] = useState(0);

    // Initialize EditorJS for active tab
    useEffect(() => {
        if (activeTab === null || tabs.length === 0) return;

        let editorInstance;

        const initEditor = async () => {
            // make sure container exists
            const holderId = `editorjs-${activeTab}`;
            const container = document.getElementById(holderId);
            if (!container) return; // skip if div not ready

            if (editorsRef.current[activeTab]) {
                await editorsRef.current[activeTab].destroy();
                delete editorsRef.current[activeTab];
            }

            // const { default: EditorJS } = await import('@editorjs/editorjs');
            // const { default: Header } = await import('@editorjs/header');
            // const { default: List } = await import('@editorjs/list');
            // const { default: Paragraph } = await import('@editorjs/paragraph');
            // const { default: Marker } = await import('@editorjs/marker');
            // const { default: Hyperlink } = await import('editorjs-hyperlink');
            // const { default: SimpleImage } = await import('@editorjs/simple-image');
            // const { default: Table } = await import('@editorjs/table');

            // editorInstance = new EditorJS({
            //     holder: holderId,
            //     tools: {
            //         header: { class: Header, inlineToolbar: true },
            //         list: { class: List, inlineToolbar: true },
            //         marker: { class: Marker, inlineToolbar: true },
            //         paragraph: { class: Paragraph, inlineToolbar: true },
            //         hyperlink: { class: Hyperlink, inlineToolbar: true },
            //         image: SimpleImage,
            //         table: { class: Table, inlineToolbar: true },
            //     },
            //     data: tabs[activeTab]?.content || {},
            //     placeholder: 'Type here...',
            //     onChange: async () => {
            //         if (!editorInstance) return;
            //         const savedData = await editorInstance.save();
            //         setTabs(prev => {
            //             const updated = [...prev];
            //             updated[activeTab] = { ...updated[activeTab], content: savedData };
            //             return updated;
            //         });
            //     },
            // });

            import("@toast-ui/editor").then(async (mod) => {
                const colorSyntax = require('@toast-ui/editor-plugin-color-syntax');
                const tableMergedCell = require('@toast-ui/editor-plugin-table-merged-cell');

                editorInstance = new mod.Editor({
                    el: document.querySelector(`#${holderId}`),
                    height: '430px',
                    initialEditType: 'wysiwyg',
                    initialValue: tabs[activeTab].info_text,
                    usageStatistics: false,
                    plugins: [colorSyntax, tableMergedCell],
                    events: {
                        change: () => {
                            const markdown = editorInstance.getMarkdown();

                            setTabs((prevTabs) => {
                                const newTabs = [...prevTabs];
                                newTabs[activeTab] = {
                                    ...newTabs[activeTab],
                                    info_text: markdown,
                                };
                                return newTabs;
                            });
                        }
                    }
                });
            });

            

            editorsRef.current[activeTab] = editorInstance;
        };

        // wait for React to flush DOM changes before init
        const timer = setTimeout(initEditor, 0);

        return () => {
            clearTimeout(timer);
            if (editorsRef.current[activeTab]) {
                editorsRef.current[activeTab].destroy();
                delete editorsRef.current[activeTab];
            }
        };
    }, [activeTab, editorKey]);

    useEffect(() => {
        onSaveAll(tabs);
    }, [tabs]);

    useEffect(() => {
        return () => {
            Object.values(editorsRef.current).forEach(editor => {
                if (editor && typeof editor.destroy === "function") {
                    editor.destroy();
            }
            });
            editorsRef.current = {};
        };
    }, []);

    const addTab = () => {
        setTabs(prevTabs => {
            const newTabs = [
                ...prevTabs,
                {
                    name: `Tab mới ${prevTabs.length + 1}`,
                    info_text: ""
                }
            ];
            setActiveTab(newTabs.length - 1);
            return newTabs;
        });
    };

    const deleteTab = (id) => {
        setTabs(prev => {
            const newTabs = prev.filter((_, i) => i !== id);

            if (newTabs.length === 0) {
                setActiveTab(null);
            } else if (id >= newTabs.length) {
                // deleted the last tab, so move focus to new last
                setActiveTab(newTabs.length - 1);
            } else {
                // focus stays on same index
                setActiveTab(id);
            }

            return newTabs;
        });
        setEditorKey(prev => prev + 1);
    };

    // const handleSaveInfoTabs = (index, data) => {
    //     setTabs(prevTabs => {
    //         const updatedTabs = [...prevTabs];
    //         updatedTabs[index] = {
    //             ...updatedTabs[index],
    //             info_text: data, // update content
    //         };
    //         return updatedTabs;
    //     });
    // };

    // const handleSaveAll = () => {
    //     onSaveAll(tabs); // send data back to parent
    // };

    const startEditingTab = (index, currentName) => {
        setEditingTabNameIndex(index);
        setTempTabName(currentName);
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
            {/* <button className='save-info-tabs' onClick={handleSaveAll}>
                Lưu thay đổi
            </button> */}

            {/* Tab buttons */}
                <div className='create-comp-tabs-container'>
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`create-comp-tab comp-info-tab ${activeTab === index ? "open" : ""} ${editingTabNameIndex === index ? "renaming" : ""}`}
                            onClick={() => setActiveTab(index)}
                            onDoubleClick={() => startEditingTab(index, tab.name)}
                        >
                            {editingTabNameIndex === index ? (
                                <input
                                    type="text"
                                    value={tempTabName}
                                    autoFocus
                                    onChange={(e) => setTempTabName(e.target.value)}
                                    onBlur={(e) => {
                                        setEditingTabNameIndex(null);
                                        handleRenameTab(index, e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setEditingTabNameIndex(null);
                                            handleRenameTab(index, e.target.value);
                                        }
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
                    <div className={`add-info-tab`} onClick={addTab}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg></div>
                </div>

            
            {/* Editor for active tab */}
            <div style={{ marginTop: '1em' }}>
                {tabs.length > 0 && activeTab !== null ? (
                    <div key={`${activeTab}-${editorKey}`} id={`editorjs-${activeTab}`} style={{ border: 'none', minHeight: '200px' }} />
                ) : (
                    "Không có tab nào được tạo."
                )}
            </div>
        </div>
    );
}