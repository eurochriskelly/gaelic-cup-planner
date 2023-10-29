import React, { useState } from 'react';
import styles from './UpdateFixture.module.css';

const UpdateFixture = ({ fixture, updateFixture }) => {
    const [enableStates, setEnableStates] = useState({
        start: 'enabled',
        postpone: 'enabled',
        cancel: 'enabled',
        finish: 'disabled',
    });
    const [visibleDrawers, setVisibleDrawers] = useState({
        finsih: false,
        cancel: false,
        postpone: false,
        start: false,
    });

    const handleClick = {
        start: () => {
            setEnableStates({
                start: 'disabled',
                postpone: 'disabled',
                cancel: 'enabled',
                finish: 'enabled'
            })
        },
        finish: () => {
            setEnableStates({
                start: 'disabled',
                postpone: 'disabled',
                cancel: 'enabled',
                finish: 'disabled'
            })
        }
    }

    return (
        <div className={styles.container}>
            <div>
                <button className={enableStates.start} onClick={handleClick.start}>
                    Start&nbsp;
                    <svg width="29" height="29" viewBox="0 0 20 20">
                        <polygon points="8,5 16,12 8,19" fill="white"></polygon>
                    </svg>
                </button>
                <button className={enableStates.postpone}>
                    Postpone&nbsp;
                    <svg width="22" height="22" viewBox="0 0 20 20">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth={2} fill="none"></circle>
                        <path d="M 12,12 L 12,6" stroke="white"></path>
                        <path d="M 12,12 L 16,16" stroke="white"></path>
                    </svg>
                </button>
                <button className={enableStates.cancel}>
                    Cancel&nbsp;
                    <svg width="22" height="22" viewBox="0 0 22 22">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="3px" fill="none"></circle>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth={2}></line>
                    </svg>
                </button>
                <button className={enableStates.finish} onClick={handleClick.finish}>
                    Finish&nbsp;
                    <svg width="26" height="26" viewBox="0 0 20 20">
                        <rect x="5" y="5" width="14" height="14" fill="white"></rect>
                    </svg>
                </button>
            </div>
            <div className={styles.drawers}>
                <div className="start">
                    <div className="start-time">
                        <span>Start time</span>
                        <span>12:00</span>
                    </div>
                    <div className="start-time">
                        <span>Duration</span>
                        <span>60 mins</span>
                    </div>
                </div>
                <div className="postpone">
                    <div className="postpone-time">
                        <span>Postpone time</span>
                        <span>12:00</span>
                    </div>
                    <div className="postpone-time">
                        <span>Duration</span>
                        <span>60 mins</span>
                    </div>
                </div>
                <div className="cancel">
                    <div className="cancel-time">
                        <span>Cancel time</span>
                        <span>12:00</span>
                    </div>
                </div>
                <div className="finish">
                    <div className="finish-time">
                        <span>Finish time</span>
                        <span>12:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateFixture;
