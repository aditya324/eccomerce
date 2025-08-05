// 

// ==========================================================
// TEMPORARY TEST CODE for frontend/app/page.tsx
// ==========================================================

export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      fontSize: '20px',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1a73e8' }}>It Works!</h1>
        <p>This minimal test page has loaded successfully.</p>
        <p>This proves the problem is inside one of your custom components.</p>
      </div>
    </div>
  );
}