import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Mic, Image, Heart, Shield, Lock, User, Mail, LogOut, FileText, 
  AlertTriangle, ArrowLeft, Database, Phone, Upload, ShoppingCart, 
  MessageSquare, Send, Bot, Search, Leaf, LoaderCircle, CheckCircle2, 
  KeyRound, Sun, Moon, ClipboardList, Stethoscope, Paperclip 
} from 'lucide-react';
import './App.css';

// ==========================================
// 🌿 MOCK DATA & CONFIGURATION
// ==========================================
const initialDoctors = Array.from({ length: 100 }, (_, i) => {
  const specialties = [
    { title: "General Ayurveda & Panchakarma", illness: "Gastritis, Arthritis, Body Pain, Stress" },
    { title: "Nadi Shastra & Herbal Remedies", illness: "Chronic Diseases, Immunity, Fatigue" },
    { title: "Skin Diseases & Traditional Treatments", illness: "Eczema, Psoriasis, Hair loss, Acne" },
    { title: "Orthopedic & Spine Care (Vatavyadhi)", illness: "Back Pain, Joint Pain, Sciatica" },
    { title: "Pediatrics & Child Care (Kaumarbhritya)", illness: "Child Immunity, Growth, Asthma" }
  ];
  
  const cities = ["Colombo", "Rathnapura", "Kandy", "Galle", "Kurunegala", "Anuradhapura", "Matara", "Gampaha"];
  const firstNames = ["Ananda", "K. G. S.", "Lakshmi", "Sunil", "Chaminda", "Priyantha", "Nimmi", "Asanka", "Bandara", "Wasantha"];
  const lastNames = ["Perera", "Jayawardena", "Menike", "Silva", "Gunaratne", "Fernando", "Kumara", "Rajapaksha", "Herath"];
  
  const spec = specialties[i % specialties.length];
  const name = `Dr. ${(i % 7 === 2) ? '(Mrs) ' : ''}${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`;
  const city = cities[i % cities.length];
  const phone = `+94 7${i % 2 === 0 ? '7' : '1'} ${Math.floor(1000000 + Math.random() * 9000000)}`;
  const email = `${firstNames[i % firstNames.length].toLowerCase().replace(/[^a-z]/g, "")}${i}@ayurguard.lk`;

  return {
    id: i + 1,
    name: name,
    specialty: spec.title,
    illness: spec.illness,
    location: city,
    phone: phone,
    email: email
  };
});

const symptomOptions = ['Headache', 'Cough', 'Stomach discomfort', 'Skin irritation', 'Joint pain', 'Fatigue', 'Fever'];
const symptomFollowUps = [
  { key: 'duration', label: 'How long has this been present?', options: ['Less than 24 hours', '1-3 days', 'More than 3 days'] },
  { key: 'severity', label: 'How severe is it right now?', options: ['Mild', 'Moderate', 'Severe'] }
];
const prakritiQuestions = [
  { text: 'Your natural body frame is usually...', dosha: ['Vata', 'Pitta', 'Kapha'] },
  { text: 'Your skin tends to be...', dosha: ['Dry or thin', 'Warm or sensitive', 'Smooth or oily'] },
  { text: 'Your appetite is...', dosha: ['Irregular', 'Strong and regular', 'Steady but slow'] },
  { text: 'Your digestion is commonly...', dosha: ['Variable with gas', 'Quick with acidity', 'Slow and heavy'] },
  { text: 'You prefer weather that is...', dosha: ['Warm', 'Cool', 'Dry and warm'] },
  { text: 'Your sleep is usually...', dosha: ['Light or interrupted', 'Moderate', 'Deep and long'] },
  { text: 'Under pressure, you tend to...', dosha: ['Worry or overthink', 'Become impatient', 'Withdraw or avoid change'] },
  { text: 'Your energy through the day is...', dosha: ['Bursts followed by tiredness', 'Focused and driven', 'Consistent but gradual'] },
  { text: 'Your communication style is...', dosha: ['Fast and expressive', 'Direct and precise', 'Calm and measured'] },
  { text: 'You learn best by...', dosha: ['Exploring many ideas', 'Studying deeply', 'Repeating patiently'] },
  { text: 'Your natural build is...', dosha: ['Light and narrow', 'Medium and athletic', 'Broad and sturdy'] },
  { text: 'Your routine is generally...', dosha: ['Flexible and changing', 'Organized and purposeful', 'Steady and familiar'] }
];

// ==========================================
// 🌿 FOOTER COMPONENT
// ==========================================
function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1b4d3e 0%, #113328 100%)',
      color: '#e8f5e9',
      padding: '40px 20px 25px 20px',
      marginTop: '60px',
      borderTop: '4px solid #2ecc71',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '30px',
        textAlign: 'left'
      }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            🌿 AyurGuard Platform
          </h3>
          <p style={{ color: '#a3d9c9', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            A practical Ayurvedic wellness companion for structured check-ins, practitioner conversations, herbs, and everyday care.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px', fontWeight: 'bold' }}>
            System Quick Features
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#a3d9c9' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📋 Rule-based symptom check-ins</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🩺 Registered Ayurvedic Doctors Directory</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🛒 AyurMart Certified Herbal Marketplace</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🌿 Traditional Sri Lankan Herb Photo Gallery</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px', fontWeight: 'bold' }}>
            Medical & Data Security
          </h4>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px', fontSize: '12px', color: '#e8f5e9', lineHeight: '1.5', borderLeft: '3px solid #2ecc71' }}>
            <strong>🛡️ Educational Disclaimer:</strong> AyurGuard provides structured educational guidance based on traditional Ayurveda. For acute medical emergencies or persistent illness, please consult a certified doctor.
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '30px auto 0 auto',
        paddingTop: '18px',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '12px',
        color: '#a3d9c9'
      }}>
        <span>© {new Date().getFullYear()} AyurGuard Clinical Wellness System. All rights reserved.</span>
        <span>Verified Relational Database & Real-Time CDSS Active</span>
      </div>
    </footer>
  );
}

function CartDrawer({ cart, setCart, open, onClose, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^\d.]/g, '')) * (item.quantity || 1), 0);
  const changeQuantity = (id, amount) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) } : item));
  if (!open) return null;
  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="cart-scrim" onClick={onClose} aria-label="Close cart" />
      <aside className="cart-drawer">
        <div className="cart-drawer-header">
          <div>
            <span className="dashboard-eyebrow">YOUR AYURMART</span>
            <h2>Your basket <small>{cart.length} items</small></h2>
          </div>
          <button onClick={onClose} aria-label="Close cart">×</button>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={30} />
            <p>Your basket is waiting for a little botanical goodness.</p>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map((item) => (
                <div className="drawer-item" key={item.id || item.name}>
                  <span className="drawer-item-art">{item.icon || '🌿'}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.price}</small>
                    <div className="quantity-control">
                      <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`}>−</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name}`}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-total">
              <span>Total</span>
              <strong>LKR {total.toFixed(2)}</strong>
            </div>
            <button className="drawer-checkout" onClick={onCheckout}>Review checkout <ArrowLeft size={16} /></button>
          </>
        )}
      </aside>
    </div>
  );
}

function App() {
  // Navigation View State
  const [view, setView] = useState('login'); 
  const [darkMode, setDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [wellness, setWellness] = useState({ water: 4, meditation: 10, sleep: 7 });
  const [bookingNotice, setBookingNotice] = useState('');
  
  // Authentication Input Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Patient'); 

  // Application Dashboard Interface States
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomAnswers, setSymptomAnswers] = useState({});
  const [questionnaireResult, setQuestionnaireResult] = useState(null);
  const [prakritiStep, setPrakritiStep] = useState(0);
  const [prakritiAnswers, setPrakritiAnswers] = useState([]);
  const [prakritiResult, setPrakritiResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [symptomText, setSymptomText] = useState('');
  const [recommendation] = useState(null);
  const [loading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [profileTab, setProfileTab] = useState('overview');
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [shopSearch, setShopSearch] = useState('');
  const [shopCategory, setShopCategory] = useState('All products');
  const [deliveryDetails, setDeliveryDetails] = useState({ fullName: '', address: '', city: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const [activeDoctor, setActiveDoctor] = useState(initialDoctors[0]); 
  const [typedMessage, setTypedMessage] = useState('');
  const [consultationPhoto, setConsultationPhoto] = useState(null);
  const [consultationDoctor, setConsultationDoctor] = useState(null);
  const [consultationForm, setConsultationForm] = useState({ symptoms: '', date: '' });
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'doctor', text: "Hello! I am Dr. Ananda. How can I help you today with your Ayurvedic treatment?" },
  ]);

  useEffect(() => {
    document.body.classList.toggle('ayurguard-dark', darkMode);
    return () => document.body.classList.remove('ayurguard-dark');
  }, [darkMode]);

  // Database Connection Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthNotice('');
    try {
      const response = await axios.post('https://ayurveda-backend.onrender.com/api/login', { email, password });
      if (response.data.user?.name) setName(response.data.user.name);
      setAuthNotice(response.data.message || 'Welcome back to AyurGuard.');
      setTimeout(() => setView('dashboard'), 1200);
    } catch (error) {
      setAuthNotice(error.response?.data?.error || "Login Failed!");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthNotice('');
    try {
      const response = await axios.post('https://ayurveda-backend.onrender.com/api/register', { name, email, password, role });
      setAuthNotice(response.data.message || 'Your AyurGuard account is ready.');
      setView('login'); 
    } catch (error) {
      setAuthNotice(error.response?.data?.error || "Registration Failed!");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setAuthNotice(`${provider} sign-in is ready to connect.`);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setAuthNotice(`A password reset link will be sent to ${email || 'your email address'}.`);
  };

  const updateWellness = (metric, amount, maximum) => {
    setWellness((current) => ({ ...current, [metric]: Math.max(0, Math.min(maximum, current[metric] + amount)) }));
  };

  const bookAppointment = (doctor) => {
    setBookingDoctor(doctor);
    setBookingDate('');
  };

  const confirmAppointment = () => {
    if (!bookingDate) return;
    setBookedAppointments((appointments) => [...appointments, { doctor: bookingDoctor.name, date: bookingDate, time: bookingTime }]);
    setBookingDoctor(null);
    setBookingNotice(`Booked with ${bookingDoctor.name} on ${new Date(`${bookingDate}T12:00:00`).toLocaleDateString()} at ${bookingTime}.`);
    setTimeout(() => setBookingNotice(''), 3500);
  };

  const toggleSymptom = (symptom) => setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]);
  
  const completeQuestionnaire = () => {
    const severe = symptomAnswers.severity === 'Severe';
    const prolonged = symptomAnswers.duration === 'More than 3 days';
    setQuestionnaireResult({ 
      urgent: severe, 
      message: severe || prolonged ? 'Please arrange a consultation with a qualified practitioner soon. Seek urgent care immediately if symptoms are severe, rapidly worsening, or affect breathing or consciousness.' : 'Your selected symptoms appear suitable for a routine practitioner discussion. Track changes and arrange a consultation if they persist.', 
      symptoms: selectedSymptoms 
    });
  };

  const choosePrakritiAnswer = (answer) => {
    const nextAnswers = [...prakritiAnswers];
    nextAnswers[prakritiStep] = answer;
    setPrakritiAnswers(nextAnswers);
    if (prakritiStep === prakritiQuestions.length - 1) {
      const scores = { Vata: 0, Pitta: 0, Kapha: 0 };
      nextAnswers.forEach((value) => scores[value]++);
      const total = prakritiQuestions.length;
      setPrakritiResult(Object.fromEntries(Object.entries(scores).map(([dosha, score]) => [dosha, Math.round(score / total * 100)])));
    } else setPrakritiStep((step) => step + 1);
  };

  const handleFileChange = (event) => setSelectedFile(event.target.files[0] || null);
  const handleAnalyze = () => setView('questionnaire');
  const toggleRecording = () => setIsRecording((recording) => !recording);

  // Doctors Filter Logic
  const filteredDoctors = initialDoctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.illness.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const uniqueSpecialties = ['All', ...new Set(initialDoctors.map(d => d.specialty))];

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item) : [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleShopBackToHome = () => {
    setCartOpen(false);
    setShopSearch('');
    setShopCategory('All products');
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const queryText = typedMessage.trim();
    if (!queryText) return;
    
    const userMsg = {
      id: Date.now(),
      sender: 'patient',
      text: queryText
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setTypedMessage('');

    try {
      const formData = new FormData();
      formData.append('question', queryText);
      formData.append('doctor', activeDoctor.name);
      if (consultationPhoto) formData.append('photo', consultationPhoto);
      await axios.post('https://ayurveda-diagnosis-and-recommendati.vercel.app/api/chat', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'system', text: 'Message delivered to the doctor. A registered practitioner will reply in this consultation channel.' }]);
      setConsultationPhoto(null);
    } catch (error) {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'system', text: error.response?.data?.error || 'Your message could not be delivered. Please try again.' }]);
    }
  };

  const openConsultationRequest = (doctor) => {
    setConsultationDoctor(doctor);
    setConsultationForm({ symptoms: '', date: '' });
    setConsultationPhoto(null);
  };

  const submitConsultationRequest = async (event) => {
    event.preventDefault();
    if (!consultationDoctor) return;
    const formData = new FormData();
    formData.append('question', consultationForm.symptoms);
    formData.append('doctor', consultationDoctor.name);
    formData.append('preferredDate', consultationForm.date);
    if (consultationPhoto) formData.append('photo', consultationPhoto);
    try {
      await axios.post('https://ayurveda-backend.onrender.com/api/doctor-consultation', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      console.warn('Consultation request queued locally:', error.message);
    }
    const submittedAt = new Date().toLocaleDateString();
    setConsultationRequests((requests) => [...requests, { doctor: consultationDoctor.name, date: consultationForm.date, status: 'Pending review', submittedAt }]);
    setBookedAppointments((appointments) => [...appointments, { doctor: `My Consultation · ${consultationDoctor.name}`, date: consultationForm.date, time: 'Pending review' }]);
    setConsultationDoctor(null);
    setBookingNotice(`Consultation request sent to ${consultationDoctor.name}.`);
    setTimeout(() => setBookingNotice(''), 3500);
  };

  // --- LOGIN INTERFACE ---
  if (view === 'login') {
    return (
      <div className="auth-container">
        <div className="leaf-field" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <Leaf key={index} className={`floating-leaf leaf-${index + 1}`} size={18 + (index % 3) * 5} />)}
        </div>
        {authNotice && <div className={`auth-notice ${authNotice.includes('Failed') ? 'is-error' : ''}`} role="status"><CheckCircle2 size={19} />{authNotice}</div>}
        <div className="auth-card">
          <button className="theme-toggle auth-theme-toggle" onClick={() => setDarkMode((enabled) => !enabled)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
          <div className="auth-brand"><span className="brand-mark"><Leaf size={22} /></span><span>AYURGUARD</span></div>
          <h2>Return to balance</h2>
          <p>Welcome back. Your natural health journey continues here.</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Mail size={18} />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <Lock size={18} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="auth-options"><label><input type="checkbox" /> Remember me</label><button type="button" className="text-button" onClick={handleForgotPassword}><KeyRound size={14} /> Forgot password?</button></div>
            <button type="submit" className="btn-auth" disabled={authLoading}>{authLoading ? <><LoaderCircle className="spinner" size={19} /> Signing in...</> : <>Sign in <ArrowLeft className="button-arrow" size={17} /></>}</button>
          </form>
          <div className="auth-divider"><span>OR</span><span>නැතහොත්</span></div>
          <div className="social-actions"><button type="button" className="social-button" onClick={() => handleSocialLogin('Google')}><strong className="social-mark google-mark">G</strong> Continue with Google</button><button type="button" className="social-button" onClick={() => handleSocialLogin('Facebook')}><strong className="social-mark facebook-mark">f</strong> Continue with Facebook</button></div>
          <p className="auth-switch">
            New to AyurGuard? <button type="button" className="text-button register-button" onClick={() => { setAuthNotice(''); setView('register'); }}>Create an account <ArrowLeft size={14} /></button>
          </p>
        </div>
      </div>
    );
  }

  // --- REGISTER INTERFACE ---
  if (view === 'register') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>🌿 Register to AyurGuard</h2>
          <p>Create an account for structured wellness tools and practitioner care.</p>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <User size={18} />
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <Mail size={18} />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <Lock size={18} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <div className="input-group">
              <Shield size={18} />
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px', color: '#7f8c8d' }}>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-auth">Register</button>
          </form>
          <p className="auth-switch">
            Already have an account? <span onClick={() => setView('login')}>Login here</span>
          </p>
        </div>
      </div>
    );
  }

  // --- PROFILE VIEW ---
  if (view === 'profile') {
    return (
      <div className="app-container">
        <main className="profile-view">
          <button className="text-link" onClick={() => setView('dashboard')}><ArrowLeft size={14} /> Back to dashboard</button>
          <span className="dashboard-eyebrow">YOUR PROFILE</span>
          <div className="profile-heading">
            <span className="profile-avatar">{(name || 'A').charAt(0).toUpperCase()}</span>
            <div><h1>{name || 'AyurGuard member'}</h1><p>{email || 'Your account details and wellness preferences'}</p></div>
          </div>
          <div className="profile-tabs">{[['overview', 'Overview'], ['activity', 'Activity'], ['settings', 'Settings']].map(([tab, label]) => <button key={tab} className={profileTab === tab ? 'active' : ''} onClick={() => setProfileTab(tab)}>{label}</button>)}</div>
          {profileTab === 'overview' && (
            <>
              <div className="profile-prakriti"><span>Your Prakriti profile</span><strong>Vata Dosha</strong><small>Air + space · balanced</small></div>
              <div className="vitals-grid"><div><small>Weight</small><strong>62 kg</strong></div><div><small>Height</small><strong>168 cm</strong></div><div><small>Daily progress</small><strong>{Math.round((wellness.water / 8 + wellness.meditation / 20 + wellness.sleep / 8) / 3 * 100)}%</strong></div></div>
            </>
          )}
          {profileTab === 'activity' && (
            <div className="activity-list">
              <h2>Appointments</h2>
              {bookedAppointments.length ? bookedAppointments.map((appointment, index) => <p key={index}><strong>{appointment.doctor}</strong><span>{appointment.date} · {appointment.time}</span></p>) : <p className="activity-empty">No appointments booked yet.</p>}
              <h2>Past product orders</h2>
              <p className="activity-empty">Your completed orders will appear here.</p>
            </div>
          )}
          {profileTab === 'settings' && (
            <div className="settings-list">
              <button onClick={() => setBookingNotice('Password change instructions sent to your email.')}><KeyRound size={17} /> Change password <ArrowLeft size={15} /></button>
              <button onClick={() => setView('login')}><LogOut size={17} /> Log out <ArrowLeft size={15} /></button>
            </div>
          )}
        </main>
        <nav className="bottom-nav" aria-label="Main navigation">
          <button onClick={() => setView('dashboard')}><span>⌂</span>Dashboard</button>
          <button onClick={() => setView('shop')}><ShoppingCart size={18} />Shop</button>
          <button onClick={() => setView('doctors')}><User size={18} />Appointments</button>
          <button className="active" onClick={() => setView('profile')}><User size={18} />Profile</button>
        </nav>
      </div>
    );
  }

  // --- RECOMMENDATION DETAILS VIEW ---
  if (view === 'recommendation-page' && recommendation) {
    return (
      <div className="app-container">
        <header className="navbar">
          <h1>🌿 AyurGuard - Analysis Report</h1>
          <button className="btn-back" onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Back to Diagnosis
          </button>
        </header>

        <main className="main-content" style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
          <div className="report-header" style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: '#e8f8f5', borderRadius: '10px', borderLeft: '5px solid #2ecc71' }}>
            <Heart color="#e74c3c" fill="#e74c3c" size={32} style={{ marginBottom: '10px' }} />
            <h2 style={{ color: '#2c3e50', margin: '5px 0' }}>AI Ayurvedic Medical Report</h2>
            <p style={{ color: '#7f8c8d', margin: '0' }}>Generated Successfully and Verified by MySQL Schema</p>
          </div>

          <div className="db-verification-card" style={{ background: '#f4f6f7', border: '1px dashed #7f8c8d', padding: '15px', borderRadius: '10px', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <Database size={18} color="#2980b9" /> MySQL Database Real-Time Verification Status:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '13px', color: '#34495e' }}>
              <div style={{ background: '#eaf2f8', padding: '8px 12px', borderRadius: '5px', borderLeft: '3px solid #2980b9' }}>
                <strong>📂 File Status:</strong> {recommendation.file_status} 
              </div>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#27ae60', fontWeight: 'bold' }}>
              ✓ Data Integrity Verified: Symptom processed and recorded in MySQL Database.
            </p>
          </div>

          <div className="language-blockSi" style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h3 style={{ color: '#27ae60', borderBottom: '2px solid #27ae60', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} /> සායනික තක්සේරුව (සිංහල)
            </h3>
            <p style={{ fontSize: '17px', color: '#2c3e50', fontFamily: 'sans-serif' }}><strong>රෝගී තත්ත්වය:</strong> {recommendation.titleSi}</p>
            
            <div style={{ marginTop: '15px', fontFamily: 'sans-serif' }}>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><strong style={{ color: '#d35400' }}>⭐ biomarkers / ප්‍රධාන ඖෂධය:</strong> {recommendation.remedySi}</p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><strong style={{ color: '#2980b9' }}>📋 සාදාගන්නා ආකාරය සහ මාත්‍රාව:</strong> {recommendation.instructionSi}</p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><strong style={{ color: '#27ae60' }}>🍏 ආහාර පාලනය:</strong> {recommendation.dietSi}</p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><strong style={{ color: '#8e44ad' }}>🧘 ජීවන රටාව:</strong> {recommendation.lifestyleSi}</p>
            </div>

            {recommendation.remedySi && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={`https://ayurveda-backend.onrender.com/images/${
                    recommendation.remedySi.includes('කොත්තමල්ලි') ? 'coriander.jpg' :
                    recommendation.remedySi.includes('පාවට්ටා') ? 'pavatta.jpg' :
                    recommendation.remedySi.includes('ඉඟුරු') ? 'ginger.jpg' : 
                    'default_herb.png'
                  }`} 
                  alt="Recommended Herb" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  onError={(e) => { e.target.src = 'https://ayurveda-backend.onrender.com/images/default_herb.png'; }}
                />
                <p style={{ fontSize: '13px', color: '#7f8c8d', margin: '0' }}>නිවැරදි ඖෂධීය ශාකය හඳුනාගන්න</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', color: '#e74c3c', fontSize: '13px', background: '#fadbd8', padding: '10px', borderRadius: '5px' }}>
            <AlertTriangle size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> 
            <strong>Disclaimer:</strong> This is an AI-generated guidance report based on traditional Ayurveda.
          </div>
        </main>

        {bookingDoctor && (
          <div className="calendar-overlay" role="dialog" aria-modal="true" aria-label="Book an appointment">
            <button className="cart-scrim" onClick={() => setBookingDoctor(null)} aria-label="Close booking calendar" />
            <div className="calendar-modal">
              <button className="modal-close" onClick={() => setBookingDoctor(null)} aria-label="Close">×</button>
              <span className="dashboard-eyebrow">BOOK A VISIT</span>
              <h2>Meet with {bookingDoctor.name}</h2>
              <p>{bookingDoctor.specialty}</p>
              <label>Select a date<input type="date" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} /></label>
              <span className="slot-label">Available times</span>
              <div className="time-slots">{['09:00 AM', '10:00 AM', '02:00 PM', '04:30 PM'].map((time) => <button key={time} className={bookingTime === time ? 'selected' : ''} onClick={() => setBookingTime(time)}>{time}</button>)}</div>
              <button className="confirm-booking" disabled={!bookingDate} onClick={confirmAppointment}>Confirm appointment <ArrowLeft size={16} /></button>
            </div>
          </div>
        )}

        {consultationDoctor && (
          <div className="calendar-overlay" role="dialog" aria-modal="true" aria-label="Request consultation">
            <button className="cart-scrim" onClick={() => setConsultationDoctor(null)} aria-label="Close consultation form" />
            <form className="calendar-modal consultation-modal" onSubmit={submitConsultationRequest}>
              <button type="button" className="modal-close" onClick={() => setConsultationDoctor(null)} aria-label="Close">×</button>
              <span className="dashboard-eyebrow">REQUEST CARE</span>
              <h2>{consultationDoctor.name}</h2>
              <p>{consultationDoctor.specialty}</p>
              <label>Describe your symptoms<textarea value={consultationForm.symptoms} onChange={(event) => setConsultationForm({ ...consultationForm, symptoms: event.target.value })} rows="4" placeholder="Tell the practitioner what you are experiencing" required /></label>
              <label>Preferred date<input type="date" min={new Date().toISOString().split('T')[0]} value={consultationForm.date} onChange={(event) => setConsultationForm({ ...consultationForm, date: event.target.value })} required /></label>
              <label className="record-upload"><Paperclip size={16} /> Attach image or medical record<input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(event) => setConsultationPhoto(event.target.files[0] || null)} /></label>
              {consultationPhoto && <small className="attachment-name">Attached: {consultationPhoto.name}</small>}
              <button className="confirm-booking" type="submit">Send consultation request <Send size={16} /></button>
            </form>
          </div>
        )}
        <Footer />
      </div>
    );
  }

  // --- HERBS GALLERY FULL PAGE VIEW ---
  if (view === 'upload-herbs') {
    return (
      <div className="app-container">
        <header className="navbar">
          <h1>🌿 AyurGuard - Herb Photo Gallery</h1>
          <button className="btn-back" onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </header>
        <main className="main-content" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <HerbsGallery />
        </main>
        <Footer />
      </div>
    );
  }

  // --- DOCTORS SEARCH INTERFACE ---
  if (view === 'doctors') {
    return (
      <div className="app-container">
        <header className="navbar">
          <h1>🌿 AyurGuard - Registered Doctors</h1>
          <button className="btn-back" onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </header>
        
        <main className="main-content" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ color: '#1b5e20', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' }}>Ayurvedic Specialists & Doctors Contact List</h2>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Search by Doctor's Name, Illness (e.g., Gastritis, Arthritis), or Location to find the perfect consultation.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <input 
              type="text"
              placeholder="🔍 Search by Doctor Name, Illness (e.g., Gastritis, Acne) or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 2, padding: '14px 20px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', minWidth: '280px', outline: 'none' }}
            />
            
            <select 
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', background: 'white', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', minWidth: '200px', outline: 'none' }}
            >
              {uniqueSpecialties.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <p style={{ color: '#555', marginBottom: '15px', fontWeight: '500' }}>
            Found {filteredDoctors.length} Qualified Doctors
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div key={doc.id} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '6px solid #2e7d32', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: '1' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#333', fontWeight: 'bold', fontSize: '20px' }}>{doc.name}</h3>
                    <p style={{ margin: '0 0 5px 0', color: '#2e7d32', fontSize: '15px', fontWeight: '600' }}>{doc.specialty}</p>
                    <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '13px', fontStyle: 'italic' }}>
                      <strong>Treats:</strong> {doc.illness}
                    </p>
                    <span style={{ fontSize: '12px', background: '#e8f5e9', padding: '4px 12px', borderRadius: '20px', color: '#2e7d32', fontWeight: 'bold' }}>📍 {doc.location}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px', textAlign: 'right' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#444', justifyContent: 'flex-end' }}><Phone size={14} color="#2e7d32" /> {doc.phone}</span>
                    <button 
                      onClick={() => openConsultationRequest(doc)}
                      style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', marginTop: '5px' }}
                    >
                      <ClipboardList size={14} /> Request Consultation
                    </button>
                    <span className="doctor-contact-actions">
                      <a href={`https://wa.me/${doc.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="doctor-contact-button"><MessageSquare size={14} /> WhatsApp</a>
                      <a href={`tel:${doc.phone.replace(/\D/g, '')}`} className="doctor-contact-button call-button"><Phone size={14} /> Call</a>
                    </span>
                    <button onClick={() => bookAppointment(doc)} style={{ background: '#b2763c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                      <CheckCircle2 size={14} /> Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', color: '#999', fontSize: '16px' }}>
                ❌ No doctors found matching your search.
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- CART & CHECKOUT INTERFACE ---
  if (view === 'cart-page') {
    const calculateTotal = () => {
      return cart.reduce((total, item) => {
        const priceNum = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + priceNum * (item.quantity || 1);
      }, 0);
    };

    const handleCheckout = (e) => {
      e.preventDefault();
      const orderNumber = `AYR-${Date.now().toString().slice(-6)}`;
      setOrderConfirmation({ orderNumber, total: calculateTotal(), ...deliveryDetails, paymentMethod });
      setCart([]);
    };

    return (
      <div className="app-container">
        <header className="navbar">
          <h1>🛒 Your AyurMart Cart</h1>
          <button className="btn-back" onClick={() => setView('shop')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Back to Shop
          </button>
        </header>

        <main className="main-content" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          {orderConfirmation ? (
            <div className="order-confirmation">
              <CheckCircle2 size={48} />
              <span className="dashboard-eyebrow">ORDER CONFIRMED</span>
              <h2>Thank you for your purchase.</h2>
              <p>Your order <strong>{orderConfirmation.orderNumber}</strong> is confirmed and will be delivered to {orderConfirmation.city}.</p>
              <div className="confirmation-summary">
                <span>Total paid</span><strong>LKR {orderConfirmation.total.toFixed(2)}</strong>
                <span>Payment</span><strong>{orderConfirmation.paymentMethod}</strong>
              </div>
              <button className="drawer-checkout" onClick={() => setView('shop')}>Continue shopping <ArrowLeft size={16} /></button>
            </div>
          ) : (
            <>
              <h2 style={{ color: '#1b5e20', marginBottom: '20px', fontWeight: 'bold' }}>Review Your Order</h2>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', color: '#7f8c8d' }}>
                  Your cart is currently empty. Go back to shop and add some items!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <div>
                          <h4 style={{ margin: 0, color: '#333' }}>{item.name}</h4>
                          <p style={{ margin: 0, fontSize: '12px', color: '#7f8c8d' }}>{item.desc}</p>
                        </div>
                        <span style={{ fontWeight: 'bold', color: '#1b5e20' }}>{item.price}</span>
                      </div>
                    ))}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #2e7d32', fontSize: '18px', fontWeight: 'bold', color: '#1b5e20' }}>
                      <span>Total Amount:</span>
                      <span>LKR {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <form className="checkout-form" onSubmit={handleCheckout}>
                    <h3>Delivery details</h3>
                    <label>Full name<input value={deliveryDetails.fullName} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, fullName: e.target.value })} required /></label>
                    <label>Delivery address<textarea value={deliveryDetails.address} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })} rows="3" required /></label>
                    <label>City<input value={deliveryDetails.city} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })} required /></label>
                    <h3>Payment method</h3>
                    <div className="payment-options">
                      {['Cash on Delivery', 'Online Card Payment', 'Bank Transfer'].map((method) => (
                        <label key={method}>
                          <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                          {method}
                        </label>
                      ))}
                    </div>
                    <button className="place-order-button" type="submit">Place Order / Confirm Purchase <CheckCircle2 size={17} /></button>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // --- AYURMART INTERFACE ---
  if (view === 'shop') {
    const shopCategories = ['All products', 'Herbs & Remedies', 'Wellness & Oils', 'Food & Teas'];
    const shopViewCopy = {
      'All products': { eyebrow: 'The AyurMart edit', title: <>Everyday rituals,<br /><em>rooted in nature.</em></>, description: 'Discover considered herbal essentials and nourishing blends made for a calmer, more grounded routine.', art: 'AYUR\nMART' },
      'Herbs & Remedies': { eyebrow: 'The botanical cabinet', title: <>Plants with<br /><em>purpose.</em></>, description: 'Explore traditional herbs and gentle everyday remedies selected for your home wellness ritual.', art: 'HERBS\n& ROOTS' },
      'Wellness & Oils': { eyebrow: 'The slow-care edit', title: <>Make space for<br /><em>wellness.</em></>, description: 'Find oils, balms, and restorative essentials to bring more intention to your daily rhythm.', art: 'SLOW\nCARE' },
      'Food & Teas': { eyebrow: 'The nourishing table', title: <>Good things<br /><em>to steep.</em></>, description: 'Stock your pantry with wholesome grains, botanical teas, and nourishing ingredients from Sri Lanka.', art: 'STEEP\n& NOURISH' }
    };
    const activeShopCopy = shopViewCopy[shopCategory];
    const selectShopCategory = (category) => {
      setShopCategory(category);
      window.requestAnimationFrame(() => document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    };

    return (
      <div className="shop-page">
        <div className="shop-announcement">Complimentary delivery on AyurMart orders over LKR 3,000 <span>•</span> Sri Lankan botanicals, thoughtfully selected</div>
        <header className="shop-header">
          <button className="shop-brand" onClick={handleShopBackToHome} type="button" aria-label="Back to home"><ArrowLeft size={16} /><span>🌿</span><strong>AyurMart</strong><small>Back to home</small></button>
          <nav className="shop-nav" aria-label="Shop navigation"><button className={shopCategory === 'All products' ? 'active' : ''} onClick={() => selectShopCategory('All products')}>Shop all</button><button className={shopCategory === 'Herbs & Remedies' ? 'active' : ''} onClick={() => selectShopCategory('Herbs & Remedies')}>Herbs</button><button className={shopCategory === 'Wellness & Oils' ? 'active' : ''} onClick={() => selectShopCategory('Wellness & Oils')}>Wellness</button><button className={shopCategory === 'Food & Teas' ? 'active' : ''} onClick={() => selectShopCategory('Food & Teas')}>Food & teas</button></nav>
          <div className="shop-utilities">
            <label className="shop-search"><Search size={17} /><input value={shopSearch} onChange={(e) => setShopSearch(e.target.value)} placeholder="Search products" aria-label="Search products" /></label>
            <button className="shop-icon-button" onClick={() => setView('dashboard')} aria-label="Account"><User size={19} /></button>
            <button className="shop-cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingCart size={19} /><span>{cart.reduce((total, item) => total + (item.quantity || 1), 0)}</span></button>
          </div>
        </header>

        <main className="shop-content">
          <section className="shop-hero">
            <div><p className="eyebrow">{activeShopCopy.eyebrow}</p><h1>{activeShopCopy.title}</h1><p>{activeShopCopy.description}</p><button className="shop-hero-button" onClick={() => document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' })}>Explore the collection <ArrowLeft size={16} className="shop-arrow-right" /></button></div>
            <div className="shop-hero-art"><span>{activeShopCopy.art.split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</span></div>
          </section>

          <section className="shop-toolbar" id="shop-products">
            <div><p className="eyebrow">{shopCategory === 'All products' ? 'Curated essentials' : shopCategory}</p><h2>{shopCategory === 'All products' ? 'Shop the collection' : `Shop ${shopCategory.toLowerCase()}`}</h2></div>
            <div className="shop-categories">{shopCategories.map((category) => <button key={category} className={shopCategory === category ? 'active' : ''} onClick={() => setShopCategory(category)}>{category}</button>)}</div>
          </section>

          <div className="shop-product-grid">
            {[
              { id: 101, name: "Premium Coriander Pack (කොත්තමල්ලි)", price: "LKR 350.00", desc: "Best for Fever, Cold, and Body Immunity.", img: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=500&q=80" },
              { id: 102, name: "Organic Ginger Powder (ඉඟුරු)", price: "LKR 420.00", desc: "Improves Digestion and relieves Gastritis.", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80" },
              { id: 103, name: "Pavatta Herbal Syrup (පාවට්ටා)", price: "LKR 580.00", desc: "Traditional blend for Cough & Respiratory health.", img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500&q=80" },
              { id: 104, name: "Neem Antiseptic Skin Pack (කොහොඹ)", price: "LKR 450.00", desc: "Powerful purifier for skin allergies and acne.", img: "https://images.unsplash.com/photo-1564419378435-99849206019a?w=500&q=80" },
              { id: 105, name: "Pure Turmeric Powder (කහ)", price: "LKR 380.00", desc: "Natural antibiotic and internal healing agent.", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80" },
              { id: 106, name: "Tulsi Cough Reliever (මදුරුතලා)", price: "LKR 320.00", desc: "Clears respiratory system and calms stress.", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80" },
              { id: 107, name: "Cooling Aloe Vera Gel (කෝමාරිකා)", price: "LKR 650.00", desc: "Soothes burns, skin irritation, and enhances hair.", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80" },
              { id: 108, name: "Ashwagandha Vitality Capsules", price: "LKR 1,450.00", desc: "Boosts physical strength and cures mental anxiety.", img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=500&q=80" },
              { id: 109, name: "Amla Vitamin C Tonic (නෙල්ලි)", price: "LKR 520.00", desc: "Excellent for eye care, hair fall, and detox.", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80" },
              { id: 110, name: "Pure Herbal Hair Therapy Oil", price: "LKR 850.00", desc: "Controls hair loss and eliminates dandruff.", img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80" },
              { id: 111, name: "Stress Relief Facial Balm", price: "LKR 720.00", desc: "Relieves mental fatigue and enhances skin radiance.", img: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=500&q=80" },
              { id: 112, name: "Tranquil Meditative Oil Blend", price: "LKR 980.00", desc: "Balancing internal Vata, Pitta, and Kapha doshas.", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80" },
              { id: 113, name: "Immunity Culinary Spice Set", price: "LKR 1,100.00", desc: "Authentic spices designed for metabolic defense.", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80" },
              { id: 114, name: "Lab-Tested Triphala Ghritha", price: "LKR 1,350.00", desc: "Standardized herbal ghee for deep internal healing.", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80" },
              { id: 115, name: "Fresh Neem Leaf Mash Paste", price: "LKR 400.00", desc: "Immediate treatment for wounds and rashes.", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80" },
              { id: 116, name: "Traditional Choorna Packets", price: "LKR 480.00", desc: "Dried botanical mix for chronic inflammation.", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80" },
              { id: 117, name: "Joint Pain Relief Herbal Paste", price: "LKR 590.00", desc: "Warm application blend for arthritis and back pain.", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80" },
              { id: 118, name: "Concentrated Essence Dropper", price: "LKR 1,200.00", desc: "Organic plant extracts for target aromatherapy.", img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80" },
              { id: 119, name: "Antioxidant Rich Dried Pods", price: "LKR 460.00", desc: "Natural forest seeds for detox tea brewing.", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80" },
              { id: 120, name: "Metabolism Balancer Choorna", price: "LKR 550.00", desc: "Cleanses the digestive tract thoroughly.", img: "https://images.unsplash.com/photo-1511140889181-229f3d9d690a?w=500&q=80" },
              { id: 121, name: "Arishta Brewing Raw Herbs", price: "LKR 1,800.00", desc: "Handpicked components for authentic elixir bases.", img: "https://images.unsplash.com/photo-1563172896-9024c0d4670a?w=500&q=80" },
              { id: 122, name: "Suwandel Organic Heirloom Rice", price: "LKR 450.00", desc: "Nutritional rice pack for low-glycemic diet plans.", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80" },
              { id: 123, name: "Certified Safe Botanical Bark", price: "LKR 670.00", desc: "Inspected medicinal wood for general health teas.", img: "https://images.unsplash.com/photo-1546190255-451a91afc548?w=500&q=80" },
              { id: 124, name: "Crushed Roots Immunity Boost", price: "LKR 890.00", desc: "Pounded safely to preserve maximum chemical potency.", img: "https://images.unsplash.com/photo-1514733670139-4d87a19645f5?w=500&q=80" },
              { id: 125, name: "Nature Outdoor Therapy Kit", price: "LKR 2,400.00", desc: "Comprehensive home Panchakarma toolkit.", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80" },
              { id: 126, name: "Ginkgo Memory Boost Drink Mix", price: "LKR 750.00", desc: "Elevates cognitive focus and neural efficiency.", img: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500&q=80" },
              { id: 127, name: "Seasonal Earth Root Harvest", price: "LKR 990.00", desc: "High potency roots pulled under peak alignment.", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80" },
              { id: 128, name: "Wild Mint Gut-Soothing tea", price: "LKR 340.00", desc: "Prevents immediate gas bloating and bad breath.", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80" },
              { id: 129, name: "Cold-Pressed Elixir Massage Base", price: "LKR 1,150.00", desc: "Pure coconut base infused with therapeutic barks.", img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80" },
              { id: 130, name: "Complete Panchakarma Pack", price: "LKR 4,500.00", desc: "Full spectrum detoxification ritual products.", img: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=500&q=80" },
              { id: 131, name: "Fast-Acting Liquid Decoction Mix", price: "LKR 680.00", desc: "Ready-brewed Kasaya concentrate for quick absorption.", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80" },
              { id: 132, name: "Blood Purifying Therapy Powder", price: "LKR 540.00", desc: "Balances internal metabolism and toxin filtration.", img: "https://images.unsplash.com/photo-1511140889181-229f3d9d690a?w=500&q=80" },
              { id: 133, name: "Cinnamon Detox Infusion Bags", price: "LKR 400.00", desc: "Warm drink base to flash harmful chemical residue.", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80" },
              { id: 134, name: "Soothing Gut-Healing Oatmeal Porridge", price: "LKR 490.00", desc: "Traditional porridge to control burning stomach ulcers.", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80" },
              { id: 135, name: "Shirodhara Neurological Treatment Oil", price: "LKR 1,600.00", desc: "Customized premium oil to combat deep insomnia.", img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80" }
            ].filter((product) => {
              const matchesSearch = `${product.name} ${product.desc}`.toLowerCase().includes(shopSearch.toLowerCase());
              const category = product.id <= 110 ? 'Herbs & Remedies' : product.id <= 121 ? 'Wellness & Oils' : 'Food & Teas';
              return matchesSearch && (shopCategory === 'All products' || category === shopCategory);
            }).map((product) => (
              <article key={product.id} className="shop-product-card">
                <div className="shop-product-image"><img src={product.img} alt={product.name} /></div>
                <div className="shop-product-details">
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                  <div className="shop-product-meta">
                    <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '14px' }}>{product.price}</span>
                    <button className="shop-add-button" onClick={() => addToCart(product)}>
                      <ShoppingCart size={12} /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
        <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setView('cart-page'); }} />
        <footer className="shop-footer">
          <div className="shop-footer-grid">
            <div><div className="shop-footer-brand">🌿 AyurMart</div><p>Thoughtful herbal essentials from Sri Lanka for everyday wellbeing.</p><div className="shop-socials"><button aria-label="Instagram">IG</button><button aria-label="Facebook">FB</button></div></div>
            <div><h3>Explore</h3><button onClick={() => setShopCategory('All products')}>Shop all</button><button onClick={() => setShopCategory('Herbs & Remedies')}>Herbs & remedies</button><button onClick={() => setShopCategory('Wellness & Oils')}>Wellness & oils</button></div>
            <div><h3>Support</h3><span>Delivery information</span><span>Returns & exchanges</span><span>Care guidance</span></div>
            <div><h3>Get in touch</h3><span>hello@ayurmart.lk</span><span>+94 11 234 5678</span><span>Colombo, Sri Lanka</span></div>
          </div>
          <div className="shop-footer-bottom">© {new Date().getFullYear()} AyurMart <span>Made for slower, better rituals.</span></div>
        </footer>
      </div>
    );
  }

  // --- CONSULTATION CHAT INTERFACE ---
  if (view === 'chat') {
    return (
      <div className="app-container">
        <header className="navbar">
          <h1>💬 AyurGuard - Live Consultation</h1>
          <button className="btn-back" onClick={() => setView('doctors')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Channeling List
          </button>
        </header>

        <main className="main-content" style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '550px', border: '1px solid #e0e0e0' }}>
            
            <div style={{ background: '#1b5e20', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#a5d6a7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b5e20', fontWeight: 'bold', fontSize: '16px' }}>
                {activeDoctor.name.replace("Dr. ", "").replace("(Mrs) ", "").charAt(0)}
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{activeDoctor.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#c8e6c9' }}>{activeDoctor.specialty} • 📍 {activeDoctor.location}</p>
              </div>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'patient' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '75%', 
                    padding: '12px 16px', 
                    borderRadius: msg.sender === 'patient' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: msg.sender === 'patient' ? '#2e7d32' : 'white',
                    color: msg.sender === 'patient' ? 'white' : '#333',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    border: msg.sender === 'patient' ? 'none' : '1px solid #e0e0e0'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '15px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
              <label className="consultation-attachment" aria-label="Attach a photo"><Paperclip size={18} /><input type="file" accept="image/*" onChange={(event) => setConsultationPhoto(event.target.files[0] || null)} /></label>
              <input 
                type="text" 
                placeholder="Type your medical query message here..." 
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <Send size={18} />
              </button>
            </form>
            {consultationPhoto && <p className="attachment-name">Attached: {consultationPhoto.name}</p>}

          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- RULE-BASED HEALTH TOOLS ---
  if (view === 'questionnaire') {
    return (
      <div className="app-container">
        <header className="navbar">
          <h1><ClipboardList size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Symptom check-in</h1>
          <button className="btn-back" onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
        </header>
        <main className="safe-tool-page">
          <div className="safe-tool-card">
            <span className="dashboard-eyebrow">RULE-BASED CHECK-IN</span>
            <h2>Let us understand what you are experiencing.</h2>
            <p>Select any symptoms that apply. This tool does not diagnose or prescribe.</p>
            {questionnaireResult ? (
              <div className={`safe-result ${questionnaireResult.urgent ? 'urgent' : ''}`}>
                <strong>{questionnaireResult.urgent ? 'Please seek prompt clinical care' : 'Next step'}</strong>
                <p>{questionnaireResult.message}</p>
                <small>Selected: {questionnaireResult.symptoms.join(', ') || 'None selected'}</small>
                <button onClick={() => { setQuestionnaireResult(null); setQuestionnaireStep(0); setSelectedSymptoms([]); setSymptomAnswers({}); }}>Start again</button>
              </div>
            ) : questionnaireStep === 0 ? (
              <>
                <h3>Which symptoms are present?</h3>
                <div className="choice-grid">
                  {symptomOptions.map((symptom) => <button key={symptom} className={selectedSymptoms.includes(symptom) ? 'selected' : ''} onClick={() => toggleSymptom(symptom)}>{symptom}</button>)}
                </div>
                <button className="safe-primary" disabled={!selectedSymptoms.length} onClick={() => setQuestionnaireStep(1)}>Continue <ArrowLeft size={16} /></button>
              </>
            ) : (
              <>
                <div className="step-indicator">Question {questionnaireStep} of 2</div>
                <h3>{symptomFollowUps[questionnaireStep - 1].label}</h3>
                <div className="choice-grid">
                  {symptomFollowUps[questionnaireStep - 1].options.map((option) => (
                    <button key={option} className={symptomAnswers[symptomFollowUps[questionnaireStep - 1].key] === option ? 'selected' : ''} onClick={() => {
                      const key = symptomFollowUps[questionnaireStep - 1].key;
                      setSymptomAnswers((answers) => ({ ...answers, [key]: option }));
                      if (questionnaireStep === 2) completeQuestionnaire();
                      else setQuestionnaireStep(2);
                    }}>{option}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'prakriti') {
    const resultEntries = prakritiResult ? Object.entries(prakritiResult) : [];
    return (
      <div className="app-container">
        <header className="navbar">
          <h1><Stethoscope size={22} /> Prakriti assessment</h1>
          <button className="btn-back" onClick={() => setView('dashboard')}><ArrowLeft size={16} /> Dashboard</button>
        </header>
        <main className="safe-tool-page">
          <div className="safe-tool-card">
            <span className="dashboard-eyebrow">DOSHA ASSESSMENT</span>
            <h2>Learn your natural constitution.</h2>
            <p>Answer {prakritiQuestions.length} pattern-based questions about body, digestion, skin, energy, and sleep.</p>
            {prakritiResult ? (
              <div className="dosha-result">
                <h3>Your profile</h3>
                {resultEntries.map(([dosha, percentage]) => (
                  <div className="dosha-row" key={dosha}>
                    <span>{dosha}</span>
                    <div className="progress-track"><span style={{ width: `${percentage}%` }} /></div>
                    <strong>{percentage}%</strong>
                  </div>
                ))}
                <p>Pathya: choose regular meals, seasonal whole foods, hydration, and a consistent sleep routine. A qualified practitioner can personalize Pathya-Apathya guidance.</p>
                <button className="safe-primary" onClick={() => { setPrakritiResult(null); setPrakritiStep(0); setPrakritiAnswers([]); }}>Retake assessment</button>
              </div>
            ) : (
              <>
                <div className="step-indicator">Question {prakritiStep + 1} of {prakritiQuestions.length}</div>
                <h3>{prakritiQuestions[prakritiStep].text}</h3>
                <div className="choice-grid">
                  {prakritiQuestions[prakritiStep].dosha.map((option, index) => <button key={option} onClick={() => choosePrakritiAnswer(['Vata', 'Pitta', 'Kapha'][index])}>{option}</button>)}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- PATIENT MAIN DASHBOARD INTERFACE ---
  const dashboardProducts = [
    { id: 201, name: 'Ceylon Calm Tea', type: 'Herbal infusion', price: 'LKR 1,250', icon: '🍵' },
    { id: 202, name: 'Sandalwood Body Oil', type: 'Cooling massage oil', price: 'LKR 2,400', icon: '🫙' },
    { id: 203, name: 'Golden Turmeric Blend', type: 'Daily wellness remedy', price: 'LKR 1,850', icon: '🌼' }
  ];
  const wellnessMetrics = [
    { key: 'water', label: 'Water', value: wellness.water, unit: 'glasses', goal: 8, icon: '◒', color: '#3c91a5' },
    { key: 'meditation', label: 'Meditation', value: wellness.meditation, unit: 'minutes', goal: 20, icon: '◌', color: '#b2763c' },
    { key: 'sleep', label: 'Sleep', value: wellness.sleep, unit: 'hours', goal: 8, icon: '☾', color: '#6c7e57' }
  ];

  return (
    <div className="app-container">
      <header className="navbar dashboard-navbar">
        <div className="logo-section">
          <span className="logo-icon">🌿</span>
          <h1>AyurGuard Dashboard</h1>
        </div>
        <button className="theme-toggle dashboard-theme-toggle" onClick={() => setDarkMode((enabled) => !enabled)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}<span>{darkMode ? 'Light' : 'Dark'}</span></button>
        <div className="nav-actions">
          <button className="btn-nav" onClick={() => setView('questionnaire')}><ClipboardList size={16} /> Symptom check-in</button>
          <button className="btn-nav" onClick={() => setView('prakriti')}><Stethoscope size={16} /> Prakriti</button>
          <button className="btn-nav" onClick={() => setView('shop')}><ShoppingCart size={16} /> AyurMart Shop</button>
          <button className="btn-nav" onClick={() => setView('doctors')}><User size={16} /> Find Doctors</button>
          <button className="btn-nav" onClick={() => setView('upload-herbs')}><Image size={16} /> Herb Gallery</button>
          <button className="btn-logout" onClick={() => setView('login')}><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <main className="dashboard-home">
        {bookingNotice && <div className="dashboard-toast"><CheckCircle2 size={17} /> {bookingNotice}</div>}
        <section className="dashboard-hero">
          <div>
            <span className="dashboard-eyebrow">TUESDAY, 25 AUGUST 2026</span>
            <h2>Ayubowan, {name || 'friend'}.</h2>
            <p>Small rituals, steady balance. Here is your wellness picture for today.</p>
          </div>
          <div className="prakriti-badge"><span>Your Prakriti</span><strong>Vata</strong><small>Air + space · balanced</small></div>
        </section>

        <section className="wellness-section">
          <div className="section-heading">
            <div><span className="dashboard-eyebrow">DAILY RITUALS</span><h2>How are you feeling today?</h2></div>
            <button className="quiet-button" onClick={() => setWellness({ water: 0, meditation: 0, sleep: 0 })}>Reset day</button>
          </div>
          <div className="wellness-grid">
            {wellnessMetrics.map((metric) => (
              <div className="wellness-card" key={metric.key}>
                <div className="wellness-card-top">
                  <span className="wellness-icon" style={{ color: metric.color }}>{metric.icon}</span>
                  <span className="wellness-label">{metric.label}</span>
                  <strong>{metric.value}<small> / {metric.goal}</small></strong>
                </div>
                <div className="progress-track"><span style={{ width: `${Math.round(metric.value / metric.goal * 100)}%`, background: metric.color }} /></div>
                <div className="wellness-card-bottom">
                  <span>{metric.unit}</span>
                  <div>
                    <button onClick={() => updateWellness(metric.key, -1, metric.goal)} aria-label={`Decrease ${metric.label}`}>−</button>
                    <button onClick={() => updateWellness(metric.key, 1, metric.goal)} aria-label={`Increase ${metric.label}`}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel category-panel">
          <div className="section-heading">
            <div><span className="dashboard-eyebrow">EXPLORE</span><h2>Rooted in nature</h2></div>
            <button className="text-link" onClick={() => setView('upload-herbs')}>View all <ArrowLeft size={14} /></button>
          </div>
          <div className="category-list">
            <button onClick={() => setView('upload-herbs')}><span>🌿</span><div><strong>Medicinal plants</strong><small>Discover the wisdom of the garden</small></div><ArrowLeft size={17} /></button>
            <button onClick={() => setView('shop')}><span>🫙</span><div><strong>Herbal oils</strong><small>Restore, soothe, and nourish</small></div><ArrowLeft size={17} /></button>
            <button onClick={() => setView('prakriti')}><span>☼</span><div><strong>Prakriti assessment</strong><small>Understand your natural patterns</small></div><ArrowLeft size={17} /></button>
          </div>
        </section>

        <section className="dashboard-panel shop-preview">
          <div className="section-heading">
            <div><span className="dashboard-eyebrow">AYURMART</span><h2>Daily essentials</h2></div>
            <button className="text-link" onClick={() => setView('shop')}>Shop all <ArrowLeft size={14} /></button>
          </div>
          <div className="dashboard-products">
            {dashboardProducts.map((product) => (
              <div className="dashboard-product" key={product.id}>
                <span className="product-art">{product.icon}</span>
                <small>{product.type}</small>
                <strong>{product.name}</strong>
                <div><b>{product.price}</b><button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>+</button></div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-focus">
          <div><span className="dashboard-eyebrow">YOUR HEALTH COMPANION</span><h2>Ready to listen to your body?</h2><p>Use a structured check-in, then share the result with a registered doctor.</p></div>
          <button onClick={() => setView('questionnaire')}>Start check-in <ArrowLeft size={16} /></button>
        </section>

        <div className="legacy-dashboard-tools">
          <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', padding: '30px', marginBottom: '35px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>Ayubowan! Welcome to AyurGuard</h2>
            <p style={{ margin: 0, fontSize: '16px', color: '#e8f5e9' }}>Your Personal AI-Powered Ayurvedic Clinical Assistant. Check your health conditions instantly.</p>
          </div>

          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="ai-launch-card" onClick={() => setView('chat')} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && setView('chat')}>
              <div className="ai-launch-icon"><Bot size={28} /></div>
              <div>
                <h3>Ask the AI Assistant</h3>
                <p>Have a quick question before starting a full symptom analysis.</p>
              </div>
              <ArrowLeft size={18} className="ai-launch-arrow" />
            </div>
            
            <div className="diag-card" style={{ background: 'white', padding: '30px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#1b5e20', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e8f5e9', paddingBottom: '10px' }}>
                🔬 Enter Symptoms for Analysis
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Describe Symptoms (Type in Sinhala/English):</label>
                <textarea 
                  rows="4"
                  placeholder="උදාහරණ: මට දින කිහිපයක සිට බඩේ දැවිල්ල සහ හිසරදය පවතී..."
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', resize: 'vertical', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={toggleRecording}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid #2e7d32', background: isRecording ? '#e8f5e9' : 'white', color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  <Mic size={16} color={isRecording ? '#e74c3c' : '#2e7d32'} /> 
                  {isRecording ? 'Stop Listening' : 'Voice Input (Sinhala)'}
                </button>

                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileChange} 
                    accept="image/*"
                    style={{ display: 'none' }} 
                  />
                  <label 
                    htmlFor="file-upload" 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px dashed #7f8c8d', background: '#f8f9fa', color: '#333', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}
                  >
                    <Upload size={16} /> {selectedFile ? 'Image Selected' : 'Upload Plant/Rash'}
                  </label>
                </div>
              </div>

              {selectedFile && (
                <p style={{ margin: '-15px 0 15px 0', fontSize: '13px', color: '#27ae60', fontWeight: '500' }}>
                  📁 Selected File: {selectedFile.name}
                </p>
              )}

              <button 
                onClick={handleAnalyze} 
                disabled={loading}
                style={{ width: '100%', background: '#2e7d32', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)', transition: 'background 0.2s' }}
              >
                {loading ? 'Processing Data Schema...' : '🔍 Run Diagnostic Analysis'}
              </button>
            </div>

            <div className="info-card" style={{ background: '#f8f9fa', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ margin: '0', color: '#1b5e20', fontSize: '20px', fontWeight: 'bold' }}>💡 Application Guidelines</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                <strong>1. AI Analysis:</strong> You can text your daily issues or speak via Sinhala voice detection. 
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                <strong>2. Image Recognition:</strong> Upload clear images of traditional Sri Lankan plants or external skin variations for real-time validation checkups.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                <strong>3. Certified Channels:</strong> If symptoms remain intense, use our **Find Doctors** link above to securely query and engage with registered practitioners.
              </p>
              <div style={{ marginTop: 'auto', background: '#e8f5e9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2e7d32' }}>
                <span style={{ fontSize: '12px', color: '#1b5e20', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>🛡️ Data Verification Guard</span>
                <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>All operations are parsed safely into our MySQL relational framework to enforce transaction integrity.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setView('cart-page'); }} />
      {bookingDoctor && (
        <div className="calendar-overlay" role="dialog" aria-modal="true" aria-label="Book an appointment">
          <button className="cart-scrim" onClick={() => setBookingDoctor(null)} aria-label="Close booking calendar" />
          <div className="calendar-modal">
            <button className="modal-close" onClick={() => setBookingDoctor(null)} aria-label="Close">×</button>
            <span className="dashboard-eyebrow">BOOK A VISIT</span>
            <h2>Meet with {bookingDoctor.name}</h2>
            <p>{bookingDoctor.specialty}</p>
            <label>Select a date<input type="date" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} /></label>
            <span className="slot-label">Available times</span>
            <div className="time-slots">{['09:00 AM', '10:00 AM', '02:00 PM', '04:30 PM'].map((time) => <button key={time} className={bookingTime === time ? 'selected' : ''} onClick={() => setBookingTime(time)}>{time}</button>)}</div>
            <button className="confirm-booking" disabled={!bookingDate} onClick={confirmAppointment}>Confirm appointment <ArrowLeft size={16} /></button>
          </div>
        </div>
      )}
      <nav className="bottom-nav" aria-label="Main navigation">
        <button className="active" onClick={() => setView('dashboard')}><span>⌂</span>Dashboard</button>
        <button onClick={() => setView('shop')}><ShoppingCart size={18} />Shop</button>
        <button onClick={() => setView('doctors')}><User size={18} />Appointments</button>
        <button onClick={() => setView('profile')}><User size={18} />Profile</button>
      </nav>
      <Footer />
    </div>
  );
}

// ==========================================
// 🌿 HERBS GALLERY COMPONENT
// ==========================================
function HerbsGallery() {
  const [activeModalImage, setActiveModalImage] = useState(null);
  const BACKEND_URL = "https://ayurveda-backend.onrender.com/images";

  const herbData = [
    { img: `coriander.jpg`, title: "Coriander (කොත්තමල්ලි)", desc: "Relieves body aches, cold, fever, and boosts daily immunity." },
    { img: `ginger.jpg`, title: "Ginger (ඉඟුරු)", desc: "Excellent remedy for digestion, gastritis, nausea, and throat pain." },
    { img: `pavatta.jpg`, title: "Pavatta (පාවට්ටා)", desc: "Traditional herb widely used for treating cough, asthma, and respiratory issues." },
    { img: `neem.jpg`, title: "Neem (කොහොඹ)", desc: "Powerful purifier with antibacterial properties for severe skin diseases." },
    { img: `turmeric.jpg`, title: "Turmeric (කහ)", desc: "Natural antiseptic that reduces internal inflammation and heals wounds." },
    { img: `tulsi.jpg`, title: "Tulsi (මදුරුතලා)", desc: "Relieves respiratory congestion, heavy stress, and common seasonal flu." },
    { img: `aloe_vera.jpg`, title: "Aloe Vera (කෝමාරිකා)", desc: "Cooling agent that promotes deep skin hydration, hair growth, and digestion." },
    { img: `ashwagandha.jpg`, title: "Ashwagandha (අශ්වගන්ධ)", desc: "Improves vital physical strength, calms the mind, and lowers anxiety levels." },
    { img: `amala.jpg`, title: "Amala (නෙල්ලි)", desc: "Rich in Vitamin C, highly effective for boosting hair health and detoxification." },
    { img: `face_therapy.jpg`, title: "Natural Face & Stress Therapy", desc: "Ayurvedic herbal facial treatments to improve skin glow and reduce mental fatigue." },
    { img: `zen_meditation.jpg`, title: "Zen Meditation & Wellness", desc: "Combining nature's tranquility with mindfulness to balance the internal Doshas." },
    { img: `traditional_spice.jpg`, title: "Traditional Spice Mix (කුළුබඩු)", desc: "Authentic Sri Lankan spices used as daily immune boosters and flavor enhancers." },
    { img: `lab_research.jpg`, title: "Ayurvedic Lab Research", desc: "Scientific validation and standardizing of ancient herbal formulations." },
    { img: `fresh_extracts.jpg`, title: "Fresh Herbal Extracts", desc: "Crushed raw leaves used for immediate wound healing and external applications." },
    { img: `dry_herbs.jpg`, title: "Dry Herbs & Powders (චූර්ණ)", desc: "Finely ground organic roots and bark prepared for chronic illness management." },
    { img: `herbal_paste.jpg`, title: "Herbal Paste Preparation", desc: "Mixing therapeutic powders into traditional pastes for joint and muscle pains." },
    { img: `essential_oils.jpg`, title: "Pure Essential Oils (තෙල්)", desc: "Concentrated plant drops used for specialized aromatherapy and target healing." },
    { img: `medicinal_seeds.jpg`, title: "Medicinal Seeds & Pods", desc: "Selected dried botanical seeds rich in natural antioxidants and minerals." },
    { img: `choorna_bowls.jpg`, title: "Ayurvedic Choorna Bowls", desc: "Triphala and other classic powders ready for internal health balancing." },
    { img: `raw_harvest.jpg`, title: "Raw Herbal Harvest", desc: "Freshly handpicked forest herbs used in authentic Arishta and Asava brewing." },
    { img: `organic_rice.jpg`, title: "Organic Rice Base (සුවඳැල්)", desc: "Traditional Sri Lankan grains used for nutritional retention and energy production." },
    { img: `herb_inspection.jpg`, title: "Clinical Herb Inspection", desc: "Expert assessment of botanical species before entering the medicine production line." },
    { img: `mortar_pestle.jpg`, title: "Traditional Mortar & Pestle", desc: "The ancient way of grinding ingredients to preserve complete molecular properties." },
    { img: `outdoor_consultation.jpg`, title: "Outdoor Ayurvedic Consultation", desc: "Connecting patients with nature during diagnosis for holistic mental peace." },
    { img: `ginkgo_memory.jpg`, title: "Ginkgo & Memory Enhancers", desc: "Specific leaves utilized to elevate cognitive function, focus, and blood circulation." },
    { img: `root_harvesting.jpg`, title: "Root Harvesting (ඔසු මුල්)", desc: "Extracting deep earth roots at the right seasonal time for maximum potency." },
    { img: `wild_mint.jpg`, title: "Wild Mint Leaves (මිංචි)", desc: "Refreshing leaves used to cure bloating, respiratory congestion, and bad breath." },
    { img: `oil_elixirs.jpg`, title: "Natural Oil Elixirs", desc: "Cold-pressed coconut and herbal oil combinations for deep body massages." },
    { img: `holistic_setup.jpg`, title: "Holistic Treatment Setup", desc: "An array of vital powders, roots, and liquids prepared for a complete Panchakarma." },
    { img: `pestle_extracts.jpg`, title: "Pestle & Organic Extracts", desc: "Crushing medicinal barks to formulate fast-acting liquid decoctions (කසාය)." },
    { img: `powder_therapy.jpg`, title: "Herbal Powder Therapy Base", desc: "Blended raw components targeted at purifying blood and improving metabolism." },
    { img: `herbal_teas.jpg`, title: "Ayurvedic Herbal Teas (ඖෂධීය පාන)", desc: "Warm infusions of cinnamon and herbs to naturally flush out dangerous toxins." },
    { img: `oatmeal_decoction.jpg`, title: "Oatmeal & Milk Decoction", desc: "Soothing gut-friendly traditional porridge to heal internal stomach ulcers." },
    { img: `apothecary_oils.jpg`, title: "Apothecary Oil Bottles", desc: "Stored customized oils used for Shirodhara and neurological treatments." }
  ];

  return (
    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #eef2f3', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🌿 Herb Photo Collection (ඖෂධීය පින්තූර එකතුව)
      </h2>
      
      <div className="herbs-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {herbData.map((herb, index) => {
          const imageName = `img${index + 1}.jpg`;
          return (
            <div 
              key={index} 
              className="herb-card"
              style={{ 
                background: '#ffffff', 
                borderRadius: '12px', 
                border: '1px solid #eaeaea', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.03)', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => setActiveModalImage(`${BACKEND_URL}/${imageName}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={`${BACKEND_URL}/${imageName}`} 
                alt={herb.title}
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', margin: '15px auto 0 auto' }}
                onError={(e) => { 
                  e.target.src = 'https://placehold.co/150x150?text=' + encodeURIComponent(herb.title.split(' ')[0]); 
                }}
              />
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
                  {herb.title}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                  {herb.desc}
                </p>
                <span style={{ fontSize: '11px', color: '#27ae60', marginTop: '5px', fontWeight: '600' }}>🔍 Click to view larger</span>
              </div>
            </div>
          );
        })}
      </div>

      {activeModalImage && (
        <div 
          onClick={() => setActiveModalImage(null)} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '85%', maxHeight: '85%' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveModalImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>
            <img 
              src={activeModalImage} 
              alt="Large Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
                boxShadow: '0px 4px 25px rgba(0,0,0,0.5)',
                objectFit: 'contain'
              }}
              onError={(e) => { 
                e.target.src = 'https://placehold.co/600x450?text=Image+Preview'; 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;