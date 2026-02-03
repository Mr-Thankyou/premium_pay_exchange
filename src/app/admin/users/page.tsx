"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

/**
 * Single page admin user editor:
 * - select a user (or "new user")
 * - prefill form with every field (incl nested arrays)
 * - add/remove nested items, edit fields
 * - Save (PUT) / Create (POST) / Delete
 */

type Deposit = any;
type Withdrawal = any;
type Investment = any;

// ==================== 🌻Main Component ====================

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    currency: "",
    country: "",
    referral: "",
    role: "user",
    walletAddress: "",
    accountBalance: 0,
    totalProfit: 0,
    totalDeposit: 0,
    totalWithdrawal: 0,
    referralBonus: 0,
    transactions: [],
    deposits: [],
    withdrawals: [],
    investments: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const toastId = toast.loading("Loading...");
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data || []);
    toast.dismiss(toastId); // removes the loading toast
  }

  async function loadUser(id: string) {
    let toastId;
    if (id !== "new") toastId = toast.loading("Loading...");
    if (id === "new") {
      toast.dismiss(toastId);
      setSelectedId("new");
      setForm({
        username: "",
        fullname: "",
        email: "",
        phone: "",
        password: "",
        currency: "",
        country: "",
        referral: "",
        role: "user",
        walletAddress: "",
        accountBalance: 0,
        totalProfit: 0,
        totalDeposit: 0,
        totalWithdrawal: 0,
        referralBonus: 0,
        transactions: [],
        deposits: [],
        withdrawals: [],
        investments: [],
      });
      return;
    }
    const res = await fetch(`/api/admin/users/${id}`);
    const data = await res.json();
    setSelectedId(id);
    // populate form
    setForm({
      ...data,
      password: "", // don't expose hashed password — let admin set a new one if needed
    });
    toast.dismiss(toastId);
  }

  function updateField(path: string, value: any) {
    setForm((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur: any = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!cur[p]) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  // nested helpers
  function addArrayItem(key: "deposits" | "withdrawals" | "investments") {
    setForm((p: any) => ({
      ...p,
      [key]: [
        ...(p[key] || []),
        key === "investments"
          ? {
              plan: "beginner",
              amount: 0,
              dailyReturn: 0,
              accumulatedProfit: 0,
              active: true,
              startDate: new Date().toISOString(),
            }
          : {
              coin: "USDT-TRC20",
              amount: 0,
              status: "pending",
              date: new Date().toISOString(),
            },
      ],
    }));
  }

  // function removeArrayItem(key: string, index: number) {
  //   setForm((p: any) => {
  //     // This creates a deep clone of p to avoid mutating state directly.
  //     const copy = JSON.parse(JSON.stringify(p));
  //     copy[key].splice(index, 1);
  //     return copy;
  //   });
  // }

  function removeArrayItem(key: string, index: number) {
    setForm((p: any) => ({
      ...p,
      //This format is better because JSON.parse/stringify can have issues with certain data types like DATES & Undefined.
      [key]: p[key].filter((_: any, i: number) => i !== index),
    }));
  }

  function addTransaction() {
    setForm((p: any) => ({
      ...p,
      transactions: [
        ...(p.transactions || []),
        {
          type: "deposit",
          direction: "in",
          title: "",
          description: "",
          amount: 0,
          coin: "USDT",
          status: "approved",
          date: new Date().toISOString(),
        },
      ],
    }));
  }

  async function handleSave() {
    const error = validateTransactions(form.transactions || []);

    if (error) {
      toast.error(error);
      return;
    }

    const toastId = toast.loading("Loading...");

    if (selectedId === "new") {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return toast.error("Error creating", { id: toastId });
      toast.success("Created", { id: toastId });
      fetchUsers();
      return;
    }
    const res = await fetch(`/api/admin/users/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Error Saving", { id: toastId });
    fetchUsers();
    toast.success("Saved!", { id: toastId });
  }

  async function handleDelete() {
    if (selectedId === "new") return toast("Not created yet");
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${selectedId}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Error deleting");
    alert("Deleted");
    setSelectedId("new");
    await fetchUsers();
    loadUser("new");
  }

  // async function approveDeposit(d) {
  //   fetch("/api/admin/deposits/approve", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ userId: selectedId, depositId: d._id }),
  //   });
  // }

  const approveDeposit = async (deposit: any) => {
    setApprovingId(deposit._id);
    const toastId = toast.loading("Approving Deposit...");

    try {
      const res = await fetch("/api/admin/deposits/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedId,
          depositId: deposit._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message, { id: toastId });
        return;
      }

      // refresh user data after approval
      await loadUser(selectedId);

      toast.success("Deposit approved successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setApprovingId(null);
    }
  };

  const rejectDeposit = async (deposit: any) => {
    setRejectingId(deposit._id);
    const toastId = toast.loading("Rejecting Deposit...");

    try {
      const res = await fetch("/api/admin/deposits/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedId, depositId: deposit._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message, { id: toastId });
        return;
      }

      // refresh user data after rejection
      await loadUser(selectedId);

      toast.success("Deposit rejected successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setRejectingId(null);
    }
  };

  const approveWithdraw = async (w: any) => {
    setApprovingId(w._id);
    const toastId = toast.loading("Approving Withdrawal...");

    try {
      const res = await fetch("/api/admin/withdrawals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedId,
          withdrawalId: w._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message, { id: toastId });
        return;
      }

      // refresh user data after approval
      await loadUser(selectedId);

      toast.success("Withdrawal approved successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setApprovingId(null);
    }
  };

  const rejectWithdraw = async (w: any) => {
    setRejectingId(w._id);
    const toastId = toast.loading("Rejecting Withdrawal...");

    try {
      const res = await fetch("/api/admin/withdrawals/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedId, withdrawalId: w._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message, { id: toastId });
        return;
      }

      // refresh user data after rejection
      await loadUser(selectedId);

      toast.success("Withdrawal rejected successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setRejectingId(null);
    }
  };

  function validateTransactions(transactions: any[]) {
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];

      if (!tx.type) return `Transaction #${i + 1}: type is required`;
      if (!tx.direction) return `Transaction #${i + 1}: direction is required`;
      if (!tx.title) return `Transaction #${i + 1}: title is required`;
      if (!tx.amount || tx.amount <= 0)
        return `Transaction #${i + 1}: amount must be greater than 0`;
      if (!tx.coin) return `Transaction #${i + 1}: coin is required`;

      // Rule-based validation
      if (tx.type === "withdrawal" && tx.direction !== "out") {
        return `Transaction #${i + 1}: withdrawal must be OUT`;
      }

      if (tx.type === "deposit" && tx.direction !== "in") {
        return `Transaction #${i + 1}: deposit must be IN`;
      }

      if (tx.type === "investment" && tx.direction !== "out") {
        return `Transaction #${i + 1}: investment must be OUT`;
      }
    }

    return null;
  }

  return (
    <Page>
      <Left>
        <h3>Users</h3>
        <Select onChange={(e) => loadUser(e.target.value)} value={selectedId}>
          <option value="new">-- Create new user --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.fullname} ({u.email})
            </option>
          ))}
        </Select>

        <ButtonRow>
          <button
            onClick={() => {
              setSelectedId("new");
              loadUser("new");
            }}
          >
            New
          </button>
          <button onClick={fetchUsers}>Refresh</button>
        </ButtonRow>
      </Left>

      <Right>
        <Form>
          <h3>{selectedId === "new" ? "Create user" : "Edit user"}</h3>

          <Row>
            <Label>Username</Label>
            <Input
              value={form.username || ""}
              onChange={(e) => updateField("username", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Fullname</Label>
            <Input
              value={form.fullname || ""}
              onChange={(e) => updateField("fullname", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Email</Label>
            <Input
              value={form.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Phone</Label>
            <Input
              value={form.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Saved Password</Label>
            <Input value={form.savedPassword || ""} disabled />
          </Row>

          <Row>
            <Label>Password (set new)</Label>
            <Input
              value={form.password || ""}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Country</Label>
            <Input
              value={form.country || ""}
              onChange={(e) => updateField("country", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Currency</Label>
            <Input
              value={form.currency || ""}
              onChange={(e) => updateField("currency", e.target.value)}
            />
          </Row>

          <Row>
            <Label>Role</Label>
            <SelectSmall
              value={form.role || "user"}
              onChange={(e) => updateField("role", e.target.value)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </SelectSmall>
          </Row>

          <Row>
            <Label>Wallet Address</Label>
            <Input
              value={form.walletAddress || ""}
              onChange={(e) => updateField("walletAddress", e.target.value)}
            />
          </Row>

          {/* Balances */}
          <Row>
            <Label>Account Balance</Label>
            <Input
              type="number"
              value={form.accountBalance || ""}
              onChange={(e) =>
                updateField("accountBalance", Number(e.target.value))
              }
            />
          </Row>

          <Row>
            <Label>Total Deposit</Label>
            <Input
              type="number"
              value={form.totalDeposit || ""}
              onChange={(e) =>
                updateField("totalDeposit", Number(e.target.value))
              }
            />
          </Row>

          <Row>
            <Label>Total Profit</Label>
            <Input
              type="number"
              value={form.totalProfit || ""}
              onChange={(e) =>
                updateField("totalProfit", Number(e.target.value))
              }
            />
          </Row>

          <Row>
            <Label>Total Withdrawal</Label>
            <Input
              type="number"
              value={form.totalWithdrawal || ""}
              onChange={(e) =>
                updateField("totalWithdrawal", Number(e.target.value))
              }
            />
          </Row>

          {/* Transactions history: Nested Arrays  */}
          <SectionTitle>Transactions (History)</SectionTitle>
          <SmallBtn onClick={addTransaction}>+ Add transaction</SmallBtn>

          {(form.transactions || []).map((tx: any, idx: number) => (
            <ArrayCard key={idx}>
              <Row>
                <Label>Type</Label>
                <SelectSmall
                  value={tx.type}
                  onChange={(e) =>
                    updateField(`transactions.${idx}.type`, e.target.value)
                  }
                >
                  <option value="deposit">deposit</option>
                  <option value="withdrawal">withdrawal</option>
                  <option value="investment">investment</option>
                  <option value="transfer">transfer</option>
                  <option value="profit">profit</option>
                  <option value="referral_bonus">referral_bonus</option>
                </SelectSmall>

                <Label>Direction</Label>
                <SelectSmall
                  value={tx.direction || "in"}
                  onChange={(e) =>
                    updateField(`transactions.${idx}.direction`, e.target.value)
                  }
                >
                  <option value="in">in</option>
                  <option value="out">out</option>
                </SelectSmall>
              </Row>

              <Row>
                <Label>Title</Label>
                <Input
                  value={tx.title || ""}
                  onChange={(e) =>
                    updateField(`transactions.${idx}.title`, e.target.value)
                  }
                />
              </Row>

              <Row>
                <Label>Description</Label>
                <Input
                  value={tx.description || ""}
                  onChange={(e) =>
                    updateField(
                      `transactions.${idx}.description`,
                      e.target.value,
                    )
                  }
                />
              </Row>

              <Row>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={tx.amount || 0}
                  onChange={(e) =>
                    updateField(
                      `transactions.${idx}.amount`,
                      Number(e.target.value),
                    )
                  }
                />

                <Label>Coin</Label>
                <Input
                  value={tx.coin || ""}
                  onChange={(e) =>
                    updateField(`transactions.${idx}.coin`, e.target.value)
                  }
                />
              </Row>

              <Row>
                <Label>Status</Label>
                <SelectSmall
                  value={tx.status || "pending"}
                  onChange={(e) =>
                    updateField(`transactions.${idx}.status`, e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </SelectSmall>

                <SmallBtn onClick={() => removeArrayItem("transactions", idx)}>
                  Remove
                </SmallBtn>
              </Row>
            </ArrayCard>
          ))}

          {/* Nested arrays */}
          <SectionTitle>Deposits</SectionTitle>
          <SmallBtn onClick={() => addArrayItem("deposits")}>
            + Add deposit
          </SmallBtn>
          {(form.deposits || []).map((d: Deposit, idx: number) => (
            <ArrayCard key={idx}>
              <Row>
                <Label>Coin</Label>
                <Input
                  value={d.coin || ""}
                  onChange={(e) =>
                    updateField(`deposits.${idx}.coin`, e.target.value)
                  }
                />
                <Label>Amount</Label>
                <Input
                  value={d.amount || 0}
                  onChange={(e) =>
                    updateField(
                      `deposits.${idx}.amount`,
                      Number(e.target.value),
                    )
                  }
                />
              </Row>
              <Row>
                <Label>Status</Label>
                {/* <SelectSmall
                  value={d.status || "pending"}
                  onChange={(e) =>
                    updateField(`deposits.${idx}.status`, e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </SelectSmall> */}
                <Input
                  style={{ width: "auto" }}
                  value={d.status || "pending"}
                  disabled
                />
                <SmallBtn
                  style={{ background: "#4BBDA8" }}
                  onClick={() => approveDeposit(d)}
                  disabled={approvingId === d._id}
                >
                  {approvingId === d._id ? "Approving..." : "Approve"}
                </SmallBtn>
                <SmallBtn
                  style={{ background: "#BD4B5C" }}
                  onClick={() => rejectDeposit(d)}
                  disabled={rejectingId === d._id}
                >
                  {rejectingId === d._id ? "Rejecting..." : "Reject"}
                </SmallBtn>
                <SmallBtn onClick={() => removeArrayItem("deposits", idx)}>
                  Remove
                </SmallBtn>
              </Row>
            </ArrayCard>
          ))}

          <SectionTitle>Withdrawals</SectionTitle>
          <SmallBtn onClick={() => addArrayItem("withdrawals")}>
            + Add withdrawal
          </SmallBtn>
          {(form.withdrawals || []).map((d: Withdrawal, idx: number) => (
            <ArrayCard key={idx}>
              <Row>
                <Label>Coin</Label>
                <Input
                  value={d.coin || ""}
                  onChange={(e) =>
                    updateField(`withdrawals.${idx}.coin`, e.target.value)
                  }
                />
                <Label>Amount</Label>
                <Input
                  value={d.amount || 0}
                  onChange={(e) =>
                    updateField(
                      `withdrawals.${idx}.amount`,
                      Number(e.target.value),
                    )
                  }
                />
              </Row>
              <Row>
                <Label>Address</Label>
                <Input
                  value={d.address || ""}
                  onChange={(e) =>
                    updateField(`withdrawals.${idx}.address`, e.target.value)
                  }
                />
                <Label>Status</Label>
                {/* <SelectSmall
                  value={d.status || "pending"}
                  onChange={(e) =>
                    updateField(`withdrawals.${idx}.status`, e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </SelectSmall> */}
                <Input
                  style={{ width: "auto" }}
                  value={d.status || "pending"}
                  disabled
                />
                <SmallBtn
                  style={{ background: "#4BBDA8" }}
                  onClick={() => approveWithdraw(d)}
                  disabled={approvingId === d._id}
                >
                  {approvingId === d._id ? "Approving..." : "Approve"}
                </SmallBtn>
                <SmallBtn
                  style={{ background: "#BD4B5C" }}
                  onClick={() => rejectWithdraw(d)}
                  disabled={rejectingId === d._id}
                >
                  {rejectingId === d._id ? "Rejecting..." : "Reject"}
                </SmallBtn>
                <SmallBtn onClick={() => removeArrayItem("withdrawals", idx)}>
                  Remove
                </SmallBtn>
              </Row>
            </ArrayCard>
          ))}

          <SectionTitle>Investments</SectionTitle>
          <SmallBtn onClick={() => addArrayItem("investments")}>
            + Add investment
          </SmallBtn>
          {(form.investments || []).map((inv: Investment, idx: number) => (
            <ArrayCard key={idx}>
              <Row>
                <Label>Plan</Label>
                <SelectSmall
                  value={inv.plan || "beginner"}
                  onChange={(e) =>
                    updateField(`investments.${idx}.plan`, e.target.value)
                  }
                >
                  <option value="beginner">beginner</option>
                  <option value="standard">standard</option>
                  <option value="business">business</option>
                </SelectSmall>

                <Label>Amount</Label>
                <Input
                  type="number"
                  value={inv.amount || 0}
                  onChange={(e) =>
                    updateField(
                      `investments.${idx}.amount`,
                      Number(e.target.value),
                    )
                  }
                />
              </Row>

              <Row>
                <Label>Daily Return</Label>
                <Input
                  type="number"
                  value={inv.dailyReturn || 0}
                  onChange={(e) =>
                    updateField(
                      `investments.${idx}.dailyReturn`,
                      Number(e.target.value),
                    )
                  }
                />
                <Label>Accumulated Profit</Label>
                <Input
                  type="number"
                  value={inv.accumulatedProfit || 0}
                  onChange={(e) =>
                    updateField(
                      `investments.${idx}.accumulatedProfit`,
                      Number(e.target.value),
                    )
                  }
                />
              </Row>

              <Row>
                <Label>Active</Label>
                <SelectSmall
                  value={inv.active ? "true" : "false"}
                  onChange={(e) =>
                    updateField(
                      `investments.${idx}.active`,
                      e.target.value === "true",
                    )
                  }
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </SelectSmall>

                <Label>Start Date</Label>
                <Input
                  value={new Date(inv.startDate || "")
                    .toISOString()
                    .slice(0, 10)}
                  onChange={(e) =>
                    updateField(
                      `investments.${idx}.startDate`,
                      new Date(e.target.value).toISOString(),
                    )
                  }
                />
                <SmallBtn onClick={() => removeArrayItem("investments", idx)}>
                  Remove
                </SmallBtn>
              </Row>
            </ArrayCard>
          ))}

          <ButtonRow>
            <button onClick={handleSave}>Save / Create</button>
            <button onClick={handleDelete}>Delete</button>
          </ButtonRow>
        </Form>
      </Right>
    </Page>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Page = styled.div`
  display: flex;
  gap: 24px;
  padding: 30px;
`;
const Left = styled.div`
  width: 280px;
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  height: calc(100vh - 60px);
  overflow-y: auto;
`;
const Right = styled.div`
  flex: 1;
  background: #fff;
  padding: 18px;
  border-radius: 12px;
  height: calc(100vh - 60px);
  overflow-y: auto;
`;
const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const SelectSmall = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;
const Label = styled.label`
  width: 140px;
  font-weight: 600;
  color: #333;
`;
const Form = styled.div`
  max-width: 100%;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;
const SmallBtn = styled.button`
  margin-left: 8px;
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fafafa;
  cursor: pointer;
`;
const SectionTitle = styled.h4`
  margin-top: 12px;
  margin-bottom: 8px;
`;
const ArrayCard = styled.div`
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fbfbfb;
`;
