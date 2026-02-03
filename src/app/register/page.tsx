"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// ==================== 🧩Main Component ====================
export default function RegisterPage() {
  const [allowed, setAllowed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    currency: "",
    country: "",
    referral: "",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Verify page protection
  useEffect(() => {
    const code = localStorage.getItem("verifyCode");
    if (code) setAllowed(true);
  }, []);

  // Google Translate Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_block"
      );
    };
  }, []);

  async function handleSubmit() {
    const loading = toast.loading("Processing...");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    toast.dismiss(loading);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success("Account created successfully!");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  if (!allowed) {
    return (
      <Wrapper>
        <Card>
          <p>You must verify before registering.</p>
          <a
            href="/verify"
            style={{ color: "orange", textDecoration: "underline" }}
          >
            Go to verification
          </a>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card>
        {/* GOOGLE TRANSLATE */}
        <div id="google_translate_block" style={{ marginBottom: "20px" }}></div>

        <Title>Create an Account</Title>

        <Label>UserName*</Label>
        <Input name="username" onChange={handleChange} />

        <Label>FullName*</Label>
        <Input name="fullname" onChange={handleChange} />

        <Label>Your Email*</Label>
        <Input name="email" type="email" onChange={handleChange} />

        <Label>Phone Number*</Label>
        <Input name="phone" onChange={handleChange} />

        <Label>Password*</Label>
        <PasswordWrapper>
          <Input
            $noMargin
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />
          <EyeIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
        </PasswordWrapper>

        <Label>Confirm Password*</Label>
        <PasswordWrapper>
          <Input
            $noMargin
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            onChange={handleChange}
          />
          <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
        </PasswordWrapper>

        <Label>Choose Currency*</Label>
        <Select name="currency" onChange={handleChange}>
          <option value="">Choose Currency</option>
          <option value="USD">USD</option>
          <option value="RAND">RAND</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
          <option value="EUR">EUR</option>
        </Select>

        <Label>Country*</Label>
        <Select name="country" onChange={handleChange}>
          <option value="">Choose Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>

        <Label>Referral ID (Optional)</Label>
        <Input name="referral" onChange={handleChange} />

        <Button onClick={handleSubmit}>Register</Button>

        <p style={{ textAlign: "center", marginTop: "15px", color: "#aaa" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "orange", textDecoration: "underline" }}
          >
            Login
          </a>
        </p>
      </Card>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  padding: 40px 10px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 550px;
  background: #111;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #333;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  color: orange;
  margin-bottom: 25px;
  font-size: 26px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: #ccc;
`;

const Input = styled.input<{ $noMargin?: boolean }>`
  width: 100%;
  padding: 12px;
  background: #000;
  border: 1px solid #444;
  color: white;
  border-radius: 6px;
  margin-bottom: ${(props) => (props.$noMargin ? "0" : "6px")};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: #000;
  border: 1px solid #444;
  color: white;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #666;

  svg {
    display: flex;
  }

  &:hover {
    color: #7c7c7c;
  }
`;

const Button = styled.button`
  width: 100%;
  background: orange;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 15px;
  &:hover {
    background: #ff8f1f;
  }
`;
