"use client";

import { useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export default function CreateCompForm({ handleShowDialog }) {
    const [compName, setCompName] = useState(null);
    const [compVenueName, setCompVenueName] = useState(null); // the name of the venue, eg: AEON Mall Long Bien
    const [compVenueAddress, setCompVenueAddress] = useState(null); // the actual address of the venue, eg: 27 Co Linh, Long Bien, Hanoi
    const [compMode, setCompMode] = useState('off'); // online/offline
    const [compOrganiser, setCompOrganiser] = useState(null);
    const [compRegFromDate, setCompRegFromDate] = useState(null);
    const [compRegTillDate, setCompRegTillDate] = useState(null);
    const [compFromDate, setCompFromDate] = useState(null);
    const [compTillDate, setCompTillDate] = useState(null);
    const [compCompetitorLimit, setCompCompetitorLimit] = useState(0);
    const [compEvents, setCompEvents] = useState([]); // an event's round, or lunch break, or checkin...
    const [compInfoTabs, setCompInfoTabs] = useState([]);

    return (
        <div className="create-comp-backdrop">
            <div className="create-comp-container" id="create-comp-container">
                <div className="create-comp-box">
                    <Editor
                        initialValue="Nhập nội dung của tab tại đây"
                        previewStyle="tab"
                        height="100%"
                        initialEditType="wysiwyg"
                        usageStatistics={false}
                        useCommandShortcut={true}
                    />
                </div>

                <div className="create-comp-footer">
                    <button className="btn-abort" onClick={() => handleShowDialog(false)}>Hủy</button>
                    <button className="btn-submit">Tạo cuộc thi</button>
                </div>
            </div>
        </div>
    );
}