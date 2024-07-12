import styles from "./PopupScreen.module.css";

export default function PopupScreen({
    children,
    showBool,
    closeSignalHandler,
    useCloseBtn = false,
    closeBtnText = "Close",
}) {
    const bottombarShowStyles = showBool ? styles.show : styles.hide;

    return (
        <div className={`${styles.PopupScreen} ${bottombarShowStyles}`}>
            <div className={styles.viewframe}>
                {/* Passed in content */}
                <div className={styles.content}>{children}</div>

                {/* Close Button */}
                {useCloseBtn ? (
                    <div
                        className={styles.closebtn}
                        onClick={closeSignalHandler}
                    >
                        {closeBtnText}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
