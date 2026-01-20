# 🔐 Controllo Accesso Admin al Gantt Chart

## 📋 Descrizione

Il **Gantt Chart** è ora accessibile **solo agli utenti con ruolo `admin`**. Gli utenti normali e i guest non possono visualizzare né accedere a questa funzionalità.

## 🛡️ Sicurezza Implementata

### 1. **Rendering Condizionale del Pulsante**
Il pulsante "📊 Project Gantt Chart" nel menu principale è visibile **solo** se:
```javascript
userAccountRole === "admin"
```

- ✅ **Admin**: Pulsante visibile
- ❌ **User**: Pulsante nascosto
- ❌ **Guest**: Pulsante nascosto

### 2. **Protezione della Route**
Anche se un utente manipolasse lo stato client-side per aprire la vista Gantt, un controllo aggiuntivo impedisce l'accesso:

```javascript
if (userAccountRole !== "admin") {
  // Mostra schermata "Accesso Negato"
  return <AccessDeniedScreen />;
}
```

Gli utenti non-admin vedranno una schermata di errore:
- 🔴 **Titolo**: "⛔ Accesso Negato"
- 📝 **Messaggio**: "Il Gantt Chart è riservato agli amministratori"
- 🔙 **Pulsante**: "← Torna al Menu"

## 👤 Ruoli Utente

### Database: Campo `ruolo`
La tabella `utenti` ha un campo `ruolo` che può essere:
- `'admin'` - Amministratore (accesso completo)
- `'user'` - Utente normale (default)

### Backend
Il backend restituisce il ruolo in:
1. **Login**: `POST /login` → `{ user: { ruolo: "admin" } }`
2. **Verifica Sessione**: `GET /login/verify` → `{ user: { ruolo: "admin" } }`

### Frontend
Il ruolo viene salvato nello stato `userAccountRole` tramite `useAuth`:
```javascript
const { userAccountRole } = useAuth();
```

## 🧪 Come Testare

### Test 1: Utente Admin
1. Crea un utente admin nel database:
```sql
UPDATE utenti SET ruolo = 'admin' WHERE email = 'tua-email@example.com';
```

2. Effettua il login con quell'account
3. ✅ Verifica che il pulsante "📊 Project Gantt Chart" sia **visibile**
4. ✅ Clicca sul pulsante e verifica l'accesso al Gantt

### Test 2: Utente Normale
1. Effettua il login con un account normale (ruolo = 'user')
2. ❌ Verifica che il pulsante "📊 Project Gantt Chart" sia **nascosto**

### Test 3: Guest
1. Continua come Guest
2. ❌ Verifica che il pulsante "📊 Project Gantt Chart" sia **nascosto**

### Test 4: Tentativo di Bypass (Sicurezza)
1. Login come utente normale
2. Apri la console del browser
3. Prova a manipolare lo stato: `setIsGanttView(true)`
4. ✅ Verifica che appaia la schermata "Accesso Negato"

## 📂 File Modificati

### `frontend/src/hook/useAuth.js`
- ✅ Aggiunto stato `userAccountRole`
- ✅ Gestione del ruolo in `handleLoginSuccess`
- ✅ Reset del ruolo in `handleLogout` e `handleLoginGuest`
- ✅ Export di `userAccountRole`

### `frontend/src/App.jsx`
- ✅ Import di `userAccountRole` da `useAuth`
- ✅ Rendering condizionale del pulsante Gantt
- ✅ Protezione della route con controllo ruolo
- ✅ Schermata "Accesso Negato" per non-admin

## 🔧 Gestione Ruoli nel Database

### Promuovere un Utente ad Admin
```sql
UPDATE utenti 
SET ruolo = 'admin' 
WHERE email = 'admin@example.com';
```

### Degradare un Admin a User
```sql
UPDATE utenti 
SET ruolo = 'user' 
WHERE email = 'user@example.com';
```

### Verificare Ruoli
```sql
SELECT id, email, ruolo 
FROM utenti 
ORDER BY ruolo DESC;
```

## 🎯 Vantaggi

✅ **Sicurezza**: Doppio livello di protezione (UI + Route)  
✅ **UX Pulita**: Gli utenti normali non vedono opzioni che non possono usare  
✅ **Flessibilità**: Facile aggiungere altri controlli basati sul ruolo  
✅ **Manutenibilità**: Logica centralizzata in `useAuth`  

## 📝 Note Importanti

1. **Nome Variabile**: Usiamo `userAccountRole` invece di `userRole` per evitare conflitti con il ruolo di gioco (MAKER/BREAKER) usato nella modalità 1vs1.

2. **Persistenza**: Il ruolo viene recuperato dal backend ad ogni caricamento pagina tramite `/login/verify`, quindi è sempre aggiornato.

3. **Default**: Se il ruolo non è specificato, viene usato `'user'` come default.

4. **Guest**: I guest hanno `userAccountRole = null` (nessun ruolo).

## 🚀 Espansione Futura

Questa implementazione rende facile aggiungere altri controlli basati sul ruolo:

```javascript
// Esempio: Feature solo per admin
{userAccountRole === "admin" && (
  <button onClick={doAdminThing}>
    🔧 Admin Feature
  </button>
)}

// Esempio: Feature per utenti registrati (non guest)
{userAccountRole && (
  <button onClick={doUserThing}>
    👤 User Feature
  </button>
)}
```

---

**Implementato per Mastermind PWSCAM Project**  
Sicurezza e controllo accessi
