import React, { useState } from "react";
import { Plus, Trash2, X, ChevronRight, Users } from "lucide-react";

// ---- Sample seed data -------------------------------------------------
const seedCustomers = [
  {
    id: "c1",
    name: "Aharoni Family",
    SubTasks: [
      { id: "s1", NoteID: 1, IsDone: true, Title: "Noam" },
      { id: "s2", NoteID: 1, IsDone: false, Title: "Itai" },
    ],
  },
  {
    id: "c2",
    name: "Ben-David Group",
    SubTasks: [
      { id: "s3", NoteID: 2, IsDone: false, Title: "Yuval" },
    ],
  },
  {
    id: "c3",
    name: "Cohen Holdings",
    SubTasks: [],
  },
];

let rowCounter = 0;
const newRowId = () => `row-${Date.now()}-${rowCounter++}`;











// ---- Main app: Customer list -------------------------------------------
export default function CustomerManager() {
  const [notes, setNotes] = useState(seedCustomers);
  const [openCustomerId, setOpenCustomerId] = useState(null);

  const openCustomer = notes.find((c) => c.id === openCustomerId);

  const updateSons = (noteID, newSons) => {
    setNotes((prev) =>
      prev.map((c) => (c.id === noteID ? { ...c, SubTasks: newSons } : c))
    );
  };

  return (
    
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F5F1",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 20px",
      }}
    >

      {/* Customer List */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#C9A15A",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Customers
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#1B2A4A",
              margin: 0,
            }}
          >
            Customer directory
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 6 }}>
            Select a customer to view and edit their entries.
          </p>
        </div>

        {/* List of Customers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map((c) => (
            
            /// List item Card (in Button)
            <button
              key={c.id}
              onClick={() => setOpenCustomerId(c.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid #E4E0D8",
                borderRadius: 12,
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "box-shadow 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(20,28,46,0.08)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: "#1B2A4A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FBFAF8",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {c.name.charAt(0)}
                </div>

                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, color: "#1F2937" }}
                  >
                    {c.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <Users size={12} />
                    {c.SubTasks.length} {c.SubTasks.length === 1 ? "entry" : "entries"}
                  </div>
                </div>
              </div>

              <ChevronRight size={18} color="#C4C9D4" />
            </button>
          ))}
        </div>

      </div>


      {openCustomer && (
        <SonsPanel
          noteObject={openCustomer}
          onClose={() => setOpenCustomerId(null)}
          onUpdateSubTasks={updateSons}
        />
      )}
    </div>
  );
}
