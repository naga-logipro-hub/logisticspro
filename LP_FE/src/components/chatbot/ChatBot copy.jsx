import React, { useState, useEffect, useRef } from "react";
import { CButton, CCard, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilEnvelopeClosed,
  cilEnvelopeOpen,
  cilTrash,
  cilSend
} from "@coreui/icons";
import axios from "axios";

// Logo
import nagaLogo from "../../assets/naga/houseofnaga.png";
import quickActions from "./QuickActions";

/* ==============================
   USER INFO (SAFE)
============================== */
const user_info_json = localStorage.getItem("user_info");

let user_info = null;
let user_name = "there";

if (user_info_json) {
  try {
    user_info = JSON.parse(user_info_json);
    user_name = user_info?.emp_name || "there";
  } catch (e) {
    console.error("Invalid user_info JSON", e);
  }
}

/* ==============================
   INITIAL CHAT STATE
============================== */
const INITIAL_MESSAGES = [
  {
    from: "bot",
    text: `Hello ${user_name}!\nHow can we help resolve your concerns today? 👋`,
    showActions: true
  }
];

const IDLE_TIME = 60 * 1000; // 1 min

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showWelcome, setShowWelcome] = useState(false);
  const [popupReason, setPopupReason] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const idleTimer = useRef(null);
  const popupTimer = useRef(null);

  /* ==============================
     AUTO SCROLL
  ============================== */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==============================
     POPUP CONTROLLER
  ============================== */
  const showPopup = (reason) => {
    if (open) return;

    setPopupReason(reason);
    setShowWelcome(true);

    clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => {
      setShowWelcome(false);
      setPopupReason(null);
    }, 10000); // auto hide 10 sec
  };

  /* ==============================
     FIRST LOGIN POPUP
  ============================== */
  useEffect(() => {
    const firstLogin = localStorage.getItem("chatbot_first_login");
    if (!firstLogin) {
      showPopup("FIRST_LOGIN");
      localStorage.setItem("chatbot_first_login", "done");
    }
  }, []);

  /* ==============================
     IDLE DETECTION
  ============================== */
  useEffect(() => {
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        showPopup("IDLE");
      }, IDLE_TIME);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);

    resetIdle();

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      clearTimeout(idleTimer.current);
    };
  }, [open]);

  /* ==============================
     AUTO RESET (24 HOURS)
  ============================== */
  useEffect(() => {
    const lastReset = localStorage.getItem("chatbot_last_reset");
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    if (!lastReset || now - lastReset > DAY) {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem("chatbot_last_reset", now);
    }
  }, []);

  /* ==============================
     CLEAR CHAT
  ============================== */
  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.setItem("chatbot_last_reset", Date.now());
  };
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMsg }
    ]);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/chatbot", // ✅ FIXED
        { action: userMsg }                  // ✅ FIXED
      );

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Unable to get response right now." }
      ]);
    } finally {
      setLoading(false);
    }
  };


  /* ==============================
     ACTION HANDLER
  ============================== */
  const handleActionClick = async (action) => {
    setMessages((prev) => [...prev, { from: "user", text: action }]);

    if (action === "ABOUT_NAGA") {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `🏢 Naga Limited\n\nFounded in 1962 in Chennai.\n\n🍞 Foods\n🧼 Detergents\n🪨 Minerals\n⚡ Wind & Logistics`
        }
      ]);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot", { action });
      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Try again later." }
      ]);
    }
  };
  const handleQuickAction = (action) => {
    sendMessage(action);

    if (action === "NAGA_WEBSITE") {
      window.open("https://www.nagamills.com", "_blank");
    }

    if (action === "WORKUP") {
      window.open("https://workup.nagamills.com", "_blank");
    }
  };


  return (
    <>
      {/* ==============================
         POPUP (FIRST LOGIN / IDLE)
      ============================== */}
      {showWelcome && !open && (
        <div
          onClick={() => {
            setOpen(true);
            setShowWelcome(false);
            setPopupReason(null);
          }}
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            background: "#fff",
            padding: "14px 18px",
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            cursor: "pointer",
            maxWidth: 280,
            zIndex: 1000
          }}
        >
          <strong>
            {popupReason === "FIRST_LOGIN"
              ? `Welcome ${user_name}! 👋`
              : `Hey ${user_name}, need help? 🤖`}
          </strong>
          <div style={{ marginTop: 6, fontSize: 14 }}>
            I’m Naga AI Agent.<br />
            Click to start chatting.
          </div>
        </div>
      )}

      {/* ==============================
         FLOATING CHAT BUTTON
      ============================== */}
      <CButton
        color={open ? "success" : "warning"}
        className="chat-3d-btn"
        style={{
          position: "fixed",
          bottom: 20,
          right: 10,
          width: 60,
          height: 60,
          borderRadius: "50%",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: !open ? "pulse 1.5s infinite" : "none"
        }}
        onClick={() => {
          setOpen((p) => !p);
          setShowWelcome(false);
        }}
      >
        <CIcon icon={open ? cilEnvelopeOpen : cilEnvelopeClosed} size="lg" />
      </CButton>

      {/* ==============================
         CHAT WINDOW
      ============================== */}
      {open && (
        <CCard className="chat-3d-card">
          <CCardBody>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={nagaLogo} alt="Naga" style={{ height: 28, marginRight: 8 }} />
                <strong>Naga – AI Agent</strong>
              </div>
              <CIcon
                icon={cilTrash}
                title="Clear Chat"
                onClick={clearChat}
                className="clear-chat-icon"
              />
            </div>

            <div style={{ height: 260, overflowY: "auto" }}>
              {/* QUICK ACTION BUTTONS */}
              <div className="pill-actions">
                {quickActions.map((q, i) => (
                  <button
                    key={i}
                    className="pill-btn"
                    onClick={() => handleQuickAction(q.action)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              {messages.map((m, i) => (
                <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left", marginBottom: 10 }}>
                  <span
                    style={{
                      background: m.from === "user" ? "#0d6efd" : "#f1f1f1",
                      color: m.from === "user" ? "#fff" : "#000",
                      padding: "8px 12px",
                      borderRadius: 12,
                      display: "inline-block",
                      maxWidth: "90%"
                    }}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div style={{ marginTop: 10 }}>
              {loading && (
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                  Naga is typing…
                </div>
              )}

              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    outline: "none"
                  }}
                />
                <button
                  className="send-3d-btn"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </div>

          </CCardBody>
        </CCard>
      )}

      {/* ==============================
         STYLES
      ============================== */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,193,7,.5); }
          70% { box-shadow: 0 0 0 15px rgba(255,193,7,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,193,7,0); }
        }

        .chat-3d-btn {
          box-shadow: 0 6px 0 #b08900, 0 10px 18px rgba(0,0,0,.35);
          transition: all .15s ease;
        }

        .chat-3d-btn:hover {
          transform: translateY(-2px);
        }

        .chat-3d-btn:active {
          transform: translateY(4px);
        }

        .clear-chat-icon {
          cursor: pointer;
          color: #6c757d;
          transition: .2s;
        }

        .clear-chat-icon:hover {
          color: #dc3545;
          transform: scale(1.2);
        }
          .pill-actions {
                          display: flex;
                          gap: 8px;
                          flex-wrap: wrap;
                          padding: 12px;
                        }
      .chat-bubble-bot {
                          background: #ffffff;
                          border-radius: 14px;
                          padding: 10px 14px;

                          box-shadow:
                            0 2px 0 rgba(0,0,0,0.06),
                            0 6px 12px rgba(0,0,0,0.12);
                        }
                        .chat-bubble-user {
                          background: linear-gradient(135deg, #6b4eff, #b06ce8);
                          color: #fff;

                          box-shadow:
                            0 3px 0 #4a32cc,
                            0 8px 16px rgba(90,60,200,0.4);
                        }


.pill-btn {
  background: #fff;
  color: #6b4eff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;

  box-shadow:
    0 3px 0 #d6ccff,
    0 6px 12px rgba(0,0,0,0.15);

  transition: all 0.15s ease;
}

.pill-btn:hover {
  transform: translateY(-1px);
}

.pill-btn:active {
  transform: translateY(2px);
  box-shadow:
    0 1px 0 #d6ccff,
    0 3px 6px rgba(0,0,0,0.2);
}

/* ==============================
   3D SEND BUTTON
============================== */
.send-3d-btn {
  background: linear-gradient(180deg, #4e73df, #2e59d9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 6px;

  box-shadow:
    0 4px 0 #1c3faa,
    0 8px 16px rgba(0, 0, 0, 0.25);

  transition: all 0.15s ease-in-out;
}

/* Hover = slightly raised */
.send-3d-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 6px 0 #1c3faa,
    0 10px 18px rgba(0, 0, 0, 0.3);
}

/* Active = pressed */
.send-3d-btn:active {
  transform: translateY(3px);
  box-shadow:
    0 2px 0 #1c3faa,
    0 5px 10px rgba(0, 0, 0, 0.25);
}

/* Disabled (while loading) */
.send-3d-btn:disabled {
  background: #9aa5d8;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
 /* ==============================
   3D CHAT WINDOW
============================== */
.chat-3d-card {
  position: fixed;
  bottom: 60px;
  right: 40px;
  width: 300px;
  z-index: 999;

  border-radius: 10px;
  overflow: hidden;

  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;

  box-shadow:
    0 12px 0 rgba(0,0,0,0.08),
    0 25px 45px rgba(90,60,200,0.35);
}
    .chat-header {
  background: linear-gradient(135deg, #4b5bdc, #b06ce8);
  color: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ==============================
   CHAT HEADER (RAISED)
============================== */
.chat-3d-card .card-body > div:first-child {
  background: linear-gradient(180deg, #f8f9fa, #e9ecef);
  padding-bottom: 8px;

  box-shadow:
    inset 0 -1px 0 rgba(0,0,0,0.08);
}

/* ==============================
   CHAT MESSAGE AREA (INSET)
============================== */
.chat-3d-card .card-body > div:nth-child(2) {
  background: #f5f6f8;
  padding: 10px;

  box-shadow:
    inset 0 2px 6px rgba(0,0,0,0.08);
}

/* ==============================
   MESSAGE BUBBLES – 3D
============================== */
.chat-3d-card span {
  box-shadow:
    0 2px 0 rgba(0,0,0,0.08),
    0 4px 8px rgba(0,0,0,0.12);
}

/* User message */
.chat-3d-card span[style*="#0d6efd"] {
  box-shadow:
    0 3px 0 #084298,
    0 6px 12px rgba(13,110,253,0.35);
}

/* Bot message */
.chat-3d-card span[style*="#f1f1f1"] {
  box-shadow:
    0 2px 0 #cfcfcf,
    0 5px 10px rgba(0,0,0,0.15);
}

/* ==============================
   CHAT FOOTER (INPUT AREA – RAISED)
============================== */
.chat-3d-card input {
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.12);
}

/* Footer container spacing */
.chat-3d-card .card-body > div:last-child {
  background: #fff;
  padding-top: 8px;

  box-shadow:
    inset 0 1px 0 rgba(0,0,0,0.08);
}




      `}</style>
    </>
  );
};

export default ChatBot;
