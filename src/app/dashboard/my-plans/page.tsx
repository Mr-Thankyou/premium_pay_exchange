// "use client";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import toast from "react-hot-toast";

// export default function MyPlansPage() {
//   const { user } = useSelector((state: RootState) => state.user);
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Load plans safely inside the effect
//   useEffect(() => {
//     if (!user?._id) return;

//     const fetchPlans = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch("/api/my-plans");
//         if (!res.ok) throw new Error("Failed to fetch plans");

//         const data = await res.json();
//         setPlans(data.plans || []);
//       } catch (err) {
//         toast.error("Could not load plans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, [user?._id]);

//   // Controlled loading toast
//   useEffect(() => {
//     let toastId: string | undefined;

//     if (loading) {
//       toastId = toast.loading("Loading plans...");
//     }

//     return () => {
//       toast.dismiss(toastId);
//     };
//   }, [loading]);

//   const stopPlan = async (id: string) => {
//     try {
//       const res = await fetch("/api/stop-plan", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.error || "Failed to stop plan");
//         return;
//       }

//       toast.success(data.message || "Plan stopped successfully", {
//         duration: 6000,
//       });
//       // reload
//       setPlans((prev) => prev.filter((p: any) => p._id !== id));
//     } catch (error) {
//       toast.error("Network error");
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "20px",
//         background: "#fff",
//         borderRadius: "12px",
//         maxWidth: "900px",
//         margin: "0 auto",
//         marginTop: "30px",
//       }}
//     >
//       <h2 style={{ color: "#232733", marginBottom: "20px" }}>
//         My Active Plans
//       </h2>

//       {plans.length === 0 ? (
//         <p style={{ textAlign: "center", color: "#444" }}>
//           You currently have no active investment plans.
//         </p>
//       ) : (
//         plans.map((inv: any) => (
//           <div
//             key={inv._id}
//             style={{
//               border: "1px solid #eee",
//               padding: "20px",
//               borderRadius: "12px",
//               marginBottom: "20px",
//               background: "#fff",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
//             }}
//           >
//             <h3 style={{ color: "#232733" }}>{inv.plan.toUpperCase()} Plan</h3>

//             <p>
//               <strong>Capital:</strong> ${inv.amount}
//             </p>
//             <p>
//               <strong>Daily Return:</strong> {inv.dailyReturn}%
//             </p>
//             <p>
//               {/* <strong>Profit Earned:</strong> ${inv.totalProfit.toFixed(2)} */}
//               <strong>Profit Earned:</strong>{" "}
//               <span style={{ color: "darkGreen", fontWeight: "bold" }}>
//                 $
//                 {inv.liveProfit.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             </p>
//             <p>
//               <strong>Started:</strong>{" "}
//               {new Date(inv.startDate).toLocaleDateString()}
//             </p>

//             <button
//               onClick={() => stopPlan(inv._id)}
//               style={{
//                 marginTop: "10px",
//                 background: "#f7931a",
//                 color: "#fff",
//                 border: "none",
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//               }}
//             >
//               Stop Plan & Cash Out
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import toast from "react-hot-toast";

export default function MyPlansPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load plans safely inside the effect
  useEffect(() => {
    if (!user?._id) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/my-plans");
        if (!res.ok) throw new Error("Failed to fetch plans");

        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        toast.error("Could not load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user?._id]);

  // Controlled loading toast
  useEffect(() => {
    let toastId: string | undefined;

    if (loading) {
      toastId = toast.loading("Loading plans...");
    }

    return () => {
      toast.dismiss(toastId);
    };
  }, [loading]);

  const stopPlan = async (id: string) => {
    try {
      const res = await fetch("/api/stop-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to stop plan");
        return;
      }

      toast.success(data.message || "Plan stopped successfully", {
        duration: 6000,
      });
      // reload
      setPlans((prev) => prev.filter((p: any) => p._id !== id));
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        maxWidth: "900px",
        margin: "0 auto",
        marginTop: "30px",
      }}
    >
      <h2 style={{ color: "#232733", marginBottom: "20px" }}>
        My Active Plans
      </h2>

      {/* Show message only after loading */}
      {loading ? null : plans.length === 0 ? (
        <p style={{ textAlign: "center", color: "#444" }}>
          You currently have no active investment plans.
        </p>
      ) : (
        plans.map((inv: any) => (
          <div
            key={inv._id}
            style={{
              border: "1px solid #eee",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
            }}
          >
            <h3 style={{ color: "#232733" }}>{inv.plan.toUpperCase()} Plan</h3>

            <p>
              <strong>Capital:</strong> ${inv.amount}
            </p>
            <p>
              <strong>Daily Return:</strong> {inv.dailyReturn}%
            </p>
            <p>
              <strong>Profit Earned:</strong>{" "}
              <span style={{ color: "darkGreen", fontWeight: "bold" }}>
                $
                {inv.liveProfit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
            <p>
              <strong>Started:</strong>{" "}
              {new Date(inv.startDate).toLocaleDateString()}
            </p>

            <button
              onClick={() => stopPlan(inv._id)}
              style={{
                marginTop: "10px",
                background: "#f7931a",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Stop Plan & Cash Out
            </button>
          </div>
        ))
      )}
    </div>
  );
}
