import CurvedArrow from "./Modal/Arrow/CurvedArrow"
import Modal from "./Modal/Modal"
import JustifySection from "./Modal/ModalSection/JustifySection"
import ModalSection from "./Modal/ModalSection/ModalSection"
import { translations } from "../language.js" // adatta path
import { useState } from "react"

const RulesOfGame = ({
  classNameTitle = "title",
  onClose = () => { },
  maxHeight = "80vh"
}) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('rulesLanguage') || 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'it' : 'en';
    setLanguage(newLang);
    localStorage.setItem('rulesLanguage', newLang);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <Modal
      title={t('title')}
      classNameTitle={classNameTitle}
      onClose={onClose}
      maxHeight={maxHeight}
      backgroundModal="darkblue"
    >
      {/* Pulsante lingua */}
      <button
        style={{
          position: "absolute", top: '80px', right: '450px', zIndex: 10, background: 'white', border: '2px solid #ddd',
          borderRadius: '20px', width: '35px', height: "35", display: 'flex', alignItems: 'center', padding:"8px",
          justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'IT' : 'EN'}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: '50px' }}>
        <ModalSection colorText="green">
          <p style={{ textDecoration: "underline" }}>{t('singlePlayer')}</p>
        </ModalSection>

        <ModalSection colorText="white"><p>{t('desc1')}</p></ModalSection>

        <ModalSection colorText="white">
          <img src="/modalità_normale.png" alt="img modalità normale" width={300} />
        </ModalSection>

        <CurvedArrow direction="up" size={120} reverse margin={"-45px 25px 0 0"} justify={"flex-end"} />

        <ModalSection colorText="white" align="flex-end" marginBlockStart={"-20px"}>
          <p>{t('attempts')}</p>
        </ModalSection>

        <ModalSection colorText="white" align="flex-end">
          <img src="/tentativi.png" alt="img modalità normale" width={300} />
        </ModalSection>

        <CurvedArrow direction="down" margin={"-40px 0 0 15px"} />

        <ModalSection colorText="white" marginBlockStart={"-20"}>
          <p style={{ color: "blue" }}>{t('turn')}</p>
        </ModalSection>

        <ModalSection colorText="white">
          <img src="/colori.png" alt="img scelta dei colori" width={300} />
        </ModalSection>

        <CurvedArrow direction="up" reverse margin={"-45px 25px 0 0"} justify={"flex-end"} />

        <ModalSection colorText="white" align="flex-end" marginBlockStart={"-20px"}>
          <p>{t('feedback')}</p>
        </ModalSection>

        <CurvedArrow direction="down" margin={"-40px 0 0 25px"} />

        <ModalSection colorText="white" width={"100%"} marginBlockStart={"-20px"}>
          <JustifySection>
            <p>{t('black')}</p>
            <img src="/peg_nero.png" alt="img con il peg nero" width={100} height={20} />
          </JustifySection>
        </ModalSection>

        <ModalSection colorText="white" width={"100%"} marginBlockStart={"10px"} marginBlockEnd={"-40px"}>
          <JustifySection>
            <p>{t('white')}</p>
            <img style={{ marginBlockStart: "10px" }} src="/peg_bianco.png" alt="img con il peg bianco" width={100} height={20} />
          </JustifySection>
        </ModalSection>

        <CurvedArrow selectAngle={"-30deg"} reverse justify={"flex-end"} margin={"20px -10px 0 0"} />

        <ModalSection colorText="white" align="center" marginBlockStart={"-50px"}>
          <p style={{ textAlign: "center" }}>{t('ps')}</p>
        </ModalSection>

        <CurvedArrow selectAngle={"70deg"} margin={"-60px 0 0 0"} />

        <ModalSection  colorText={"white"} align="flex-start">
          <p>{t('end')}</p>
        </ModalSection>

        <ModalSection>
          <img src="/winner.png" alt="immagine di vittoria" width={300} />
        </ModalSection>
      </div>
    </Modal>
  )
}

export default RulesOfGame
