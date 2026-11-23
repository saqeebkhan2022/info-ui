import React,{useState} from "react";
import {KeyRound} from "lucide-react";
import Modal from "./Modal";
import {api} from "../services/api";
export default function ChangePassword({logout}){
 const [show,setShow]=useState(false),[error,setError]=useState("");
 return <>
      <button className="password-action"
        onClick={() => {
          setShow(true);
          setError("");
        }}
      >
        <KeyRound size={15}/> Change password
      </button>
      {show && (
        <Modal title="Change password" close={() => setShow(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api(
                  "password",
                  "POST",
                  Object.fromEntries(new FormData(e.target)),
                );
                logout();
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            <label>
              Current password
              <input type="password" name="oldPassword" required />
            </label>
            <label>
              New password
              <input type="password" name="password" minLength={12} required />
            </label>
            <p role="alert">{error}</p>
            <button className="primary">Save and sign in again</button>
          </form>
        </Modal>
      )}
 </>;
}