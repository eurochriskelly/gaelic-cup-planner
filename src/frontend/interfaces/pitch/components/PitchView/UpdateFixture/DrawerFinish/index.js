import styles from './DrawerFinish.module.css'

const DrawerFinish = ({ fixture, onClose, onConfirm }) => {
    const { Team1, Team2 } = fixture
    return <div className={styles.container}>
        <div className="drawer-header">Update match score</div>
        <div className="drawer-container">
            <div className={styles.teamScore}>
                <h4>{Team1}</h4>
                <div>
                    <input type="number" placeholder="Goals" />
                    <input type="number" placeholder="Points" />
                </div>
            </div>
            <div className={styles.teamScore}>
                <h4>{Team2}</h4>
                <div>
                    <input type="number" placeholder="Goals" />
                    <input type="number" placeholder="Points" />
                </div>
            </div>
            <div>
                <button className="enabled" onClick={onConfirm}>Proceed</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>

        <div>
            <div className="drawer-header">Carded players?</div>
            <div className="drawer-container">
                <button>Yes</button>
                <button>No</button>
            </div>
        </div>
    </div>
}

export default DrawerFinish