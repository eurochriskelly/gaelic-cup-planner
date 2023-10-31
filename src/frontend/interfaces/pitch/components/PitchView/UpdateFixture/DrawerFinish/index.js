import styles from './DrawerFinish.module.css'

const DrawerFinish = ({ fixture, onClose, onConfirm }) => {
    const { Team1, Team2 } = fixture
    return <div className={styles.container}>
        <div className={styles.drawerHead}>Update match score</div>
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
            <button onClick={onClose}>Cancel</button>
            <button onClick={onConfirm}>Confirm</button>
        </div>
        <div className="drawerHead">Carded players?</div>
        <div>
            <button>Yes</button>
            <button>No</button>
        </div>
    </div>
}

export default DrawerFinish