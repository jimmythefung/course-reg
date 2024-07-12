"use client";
import { useState } from "react";
import styles from "./EditableKVForm.module.css";

export default function EditableKVForm({
    kvData,
    keysAllowedToUpdate = [],
    changeHandler = null,
    submitHandler = null,
}) {
    const [data, setData] = useState(kvData);
    const submitUpdateButton =
        keysAllowedToUpdate.length > 0 ? (
            <input
                className={styles.updateButton}
                type="button"
                value="Update"
                onClick={(e) => {
                    submitHandler(data);
                }}
            />
        ) : (
            ""
        );

    function kvChangeHandler(k, newV) {
        setData((prev) => {
            return { ...prev, [k]: newV };
        });
    }
    return (
        <div className={styles.editablekvform}>
            {Object.entries(data).map(([k, v]) => {
                return (
                    <div key={k} className={styles.kv_pair}>
                        {/* Key display */}
                        <div className={styles.k_field}>{k}</div>
                        {/* Value display */}
                        {keysAllowedToUpdate.includes(k) ? (
                            <input
                                className={styles.v_field}
                                type="text"
                                value={v}
                                onChange={(e) => {
                                    kvChangeHandler(k, e.target.value);
                                }}
                            />
                        ) : (
                            <input
                                className={styles.v_field}
                                type="text"
                                value={v}
                                readOnly={true}
                            />
                        )}
                    </div>
                );
            })}

            {submitUpdateButton}
        </div>
    );
}
