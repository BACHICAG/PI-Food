import React from "react";
import styles from "./FormField.module.css";

export default function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className={styles.formFieldContainer}>
      <label className={styles.label}>{label}:</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.textarea}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
