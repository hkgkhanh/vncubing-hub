"use client";

export default function CompPageSidebar({ compData, url, slug }) {
    const currentDate = new Date();
    const from_date = new Date(compData.from_date);
    const till_date = new Date(compData.till_date);
    const isDuringCompPhase = currentDate >= from_date && currentDate <= till_date;
    // const isAfterCompPhase = currentDate > till_date;
    const isAfterCompPhase = true;
    return (
        <div className='comp-page-nav-list'>
            <a href={`/competitions/vnca/${slug}`} className={url == '' ? 'active' : 'unactive'} onClick={(e) => {if (url == '') e.preventDefault()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/></svg>
                Thông tin
            </a>
            <a href={`/competitions/vnca/${slug}/register`} className={url == '/register' ? 'active' : 'unactive'} onClick={(e) => {if (url == '/register') e.preventDefault()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M409 337C418.4 327.6 418.4 312.4 409 303.1L265 159C258.1 152.1 247.8 150.1 238.8 153.8C229.8 157.5 224 166.3 224 176L224 256L112 256C85.5 256 64 277.5 64 304L64 336C64 362.5 85.5 384 112 384L224 384L224 464C224 473.7 229.8 482.5 238.8 486.2C247.8 489.9 258.1 487.9 265 481L409 337zM416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480z"/></svg>
                Đăng ký
            </a>
            <a href={`/competitions/vnca/${slug}/registrations`} className={url == '/registrations' ? 'active' : 'unactive'} onClick={(e) => {if (url == '/registrations') e.preventDefault()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/></svg>
                Thí sinh
            </a>
            {isDuringCompPhase &&
                <a href={`/competitions/vnca/${slug}/live`} className={url == '/live' ? 'active' : 'unactive'} onClick={(e) => {if (url == '/live') e.preventDefault()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/></svg>
                    Trực tiếp
                </a>
            }
            {isAfterCompPhase &&
                <a href={`/competitions/vnca/${slug}/results`} className={url == '/results' ? 'active' : 'unactive'} onClick={(e) => {if (url == '/results') e.preventDefault()}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z"/></svg>
                    Kết quả
                </a>
            }
        </div>
    );
}