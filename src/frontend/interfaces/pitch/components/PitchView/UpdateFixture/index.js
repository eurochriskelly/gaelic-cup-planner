import React, { useEffect, useState } from 'react'
import DrawerFinish from './DrawerFinish'
import DrawerPostpone from './DrawerPostpone';
import styles from './UpdateFixture.module.css'

const UpdateFixture = ({
    fixture,
    updateFixtures,
    delayByOne,
    delayUntilEnd
}) => {
    const [enableStates, setEnableStates] = useState({
        start: 'enabled',
        postpone: 'enabled',
        cancel: 'enabled',
        finish: 'disabled',
    });
    const [moreOpen, setMoreOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [visibleDrawers, setVisibleDrawers] = useState({
        start: false,
        cancel: false,
        postpone: false,
        finish: false,
    });

    useEffect(() => {
        setDrawerOpen(Object.values(visibleDrawers).some(f => f))
    }, [visibleDrawers, setDrawerOpen, drawerOpen])


    const actions = {
        closeDrawer: () => {
            setEnableStates({
                start: 'start',
                postpone: 'disabled',
                cancel: 'start',
                finish: 'disabled'
            })
            setVisibleDrawers({
                start: false,
                postpone: false,
                cancel: false,
                finish: false,
            })
        },
        start: () => {
            setEnableStates({
                start: 'disabled',
                postpone: 'disabled',
                cancel: 'enabled',
                finish: 'enabled'
            })
        },
        postpone: () => {
            setEnableStates({
                start: 'disabled',
                postpone: 'disabled',
                cancel: 'enabled',
                finish: 'disabled'
            })
            setVisibleDrawers({
                start: false,
                postpone: true,
                cancel: false,
                finish: false,
            })
        },
        finish: () => {
            setEnableStates({
                start: 'disabled',
                postpone: 'disabled',
                cancel: 'disabled',
                finish: 'disabled'
            })
            setVisibleDrawers({
                start: false,
                postpone: false,
                cancel: false,
                finish: true,
            })
        },
        delayByOne: () => {
            console.log('delayByOne')
        },
        delayUntilEnd: () => {
            console.log('delayUntilEnd')
        },
        moreOptions: () => setMoreOpen(!moreOpen),
    }

    const drawerStyle = {
        display: drawerOpen ? 'flex' : 'none',
    }

    const morebuttonsStyle = {
        display: moreOpen ? 'grid' : 'none'
    }
    const Triang = ({ direction = 'right' }) => {
        const l = direction === 'left' ? '50' : '10'
        const r = direction === 'left' ? '10' : '50'
        const h = 85
        return <svg width="50" height="180" viewBox="0 0 50 10">
            <polygon points={`${l},${h} ${r},0, ${l},-${h}`} fill="#89818e" transform="scale(1, -1)"></polygon>
        </svg>
    }
    return (
        <div className={styles.updateFixture}>
            <div style={{ display: (drawerOpen || moreOpen) ? 'none' : 'grid' }}>
                <button className={enableStates.start} onClick={actions.start}>
                    Get ready&nbsp;
                    <svg width="29" height="29" viewBox="0 0 20 20">
                        <polygon points="8,5 16,12 8,19" fill="white"></polygon>
                    </svg>
                </button>
                <button className={enableStates.finish} onClick={actions.finish}>
                    Game over&nbsp;
                    <svg width="26" height="26" viewBox="0 0 20 20">
                        <rect x="5" y="5" width="14" height="14" fill="white"></rect>
                    </svg>
                </button>
                <div className={styles.more} onClick={actions.moreOptions}>
                    <Triang />
                </div>
            </div>
            <div style={morebuttonsStyle}>
                <div className={styles.more} onClick={actions.moreOptions}>
                    <Triang direction='left' />
                </div>
                <button className={enableStates.postpone} onClick={actions.postpone}>
                    Postpone&nbsp;
                    <svg width="22" height="22" viewBox="0 0 20 20">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth={2} fill="none"></circle>
                        <path d="M 12,12 L 12,6" stroke="white"></path>
                        <path d="M 12,12 L 16,16" stroke="white"></path>
                    </svg>
                </button>
                <button className={enableStates.cancel}>
                    Cancel match&nbsp;
                    <svg width="22" height="22" viewBox="0 0 22 22">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="3px" fill="none"></circle>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth={2}></line>
                    </svg>
                </button>
            </div>



            {/* DRAWERS */}
            <div className={styles.drawers} style={drawerStyle}>
                <div className="start" style={{ display: visibleDrawers.start ? 'block' : 'none' }}>
                    <div className="start-time">
                        <span>Start time</span>
                        <span>12:00</span>
                    </div>
                    <div className="start-time">
                        <span>Duration</span>
                        <span>60 mins</span>
                    </div>
                </div>
                <DrawerPostpone
                    fixture={fixture}
                    delayByOne={delayByOne}
                    delayUntilEnd={delayUntilEnd}
                    visible={visibleDrawers.postpone}
                    onClose={actions.closeDrawer}
                />
                <div className="cancel" style={{ display: visibleDrawers.cancel ? 'block' : 'none' }}>
                    <div className="cancel-time">
                        <span>Cancel time</span>
                        <span>12:00</span>
                    </div>
                </div>
                <DrawerFinish
                    fixture={fixture}
                    updateFixtures={updateFixtures}
                    visible={visibleDrawers.finish}
                    onClose={actions.closeDrawer}
                />
            </div>
        </div>
    );
};

export default UpdateFixture;
