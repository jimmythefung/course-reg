"use client";
import styles from "./ModifiableText.module.css";

export default function ModifiableText({
    textTitle = "Title",
    changeHandler,
    clickHandler = null,
    buttonName = "Add",
    displayText = "",
}) {
    const forLabel = "_".concat(textTitle);

    return (
        <div className={`${styles.modifiabletext}`}>
            {displayText.length > 0 ? (
                <h1>
                    {textTitle}: {displayText}
                </h1>
            ) : (
                ""
            )}
            <label htmlFor={forLabel}>{textTitle}</label>
            <input
                className={`${styles.modifiabletext_input}`}
                id={forLabel}
                type="text"
                onChange={(e) => {
                    changeHandler(e.target.value);
                }}
            ></input>

            {clickHandler !== null ? (
                <button
                    className={`${styles.modifiabletext_submitbutton}`}
                    onClick={clickHandler}
                >
                    {buttonName}
                </button>
            ) : (
                ""
            )}
        </div>
    );
}
