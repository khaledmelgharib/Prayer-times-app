import Spline from '@splinetool/react-spline';
import MainContent from "./Components/MainContent";
import { Container } from '@mui/material';

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* الخلفية المتحركة */}
      <Spline
        scene="https://prod.spline.design/XqLP95wrary7btwD/scene.splinecode"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -1,
          opacity: 0.8, 
        }}
      />

      {/* المحتوى */}
      <div style={{
        position: 'relative',
        zIndex: 1, 
        color: 'white', 
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        width: "100%",
        height: "100vh", 
      }}>
      <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </main>
  );
}