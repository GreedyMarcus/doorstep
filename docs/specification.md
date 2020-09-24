# Specifikáció

## 1. fázis: beléptetés

A rendszer célja egy beléptetési folyamat automatizálása a tipikusan egy irodaházban működő cégekhez.

Szerepkörök:

- Admin
- Céges admin
- Céges fogadó
- Recepciós
- Vendég

Az **adminisztrátor** fel tudja venni az irodaházban dolgozó cégeket alapadataikkal. Fel tud venni minden céghez céges adminisztrátort. Az adminisztrátor fel tudja venni a globális, látogatók által elfogadandó nyilatkozat(ok)at.

A **céges adminisztáror** feladata a cég fogadó szerepkörű embereinek felvétele. Az ő feladata a vendégek által elfogadandó nyilatkozatok felvétele, karbantartása is. Beállíthatja a látogatás elévülési idejét. Látja az adott cég látogatási naplóját, illetve megtekintheti a részleteket. (Dátum, idő, fogadó, látogatás célja, meghívott(ak), tényleges belépések ideje, ténylegesen belépett vendégek, hozzárendelt vendégkártyák, kilépések ideje, recepciós). Beállíthatja (bejelölheti), hogy a vendégről miket kell tárolni: Vez/Ker. Név, nemzetiség, lakcím: ország, város, ir.sz., utca, házszám. Mobilszám. Szül. hely, idő. Anyja neve. Cégnév. Cég címe. Cégjegyzékszám. Beállíthatja, hogy vendégkártyát kell-e regisztrálni a látogatáskor, illetve hogy a kilépés időpontját kell-e az alkalmazásban regisztrálni.

A **céges fogadó** személy email cím alapján meg tud hívni vendéget (látogatás címe, dátum, időpontja, szoba/tárgyaló)). Egy alkalomra több vendéget is hívhat. A nyilatkozatok mindig verziózottak. A naplóban el kell tárolni, hogy egy adott látogató melyik nyilatkozat verziót fogadta el. A fogadó lemondhat vagy módosíthat egy látogatást, amiről a vendég szintén értesítést kap.

A **recepciós** kliens alkalmazásban látja a közeljövőre tervezett (és még meg nem valósult) látogatásokat (cég, fogadó személy, időpont, szoba). Látja, hogy a vendég elfogadta-e már a nyilatkozatokat. Látja a vendég által feltöltött fotót. Vendég érkeztekor indítja a konkrét beléptetési folyamatot (időbélyeg elmentésével), ahol elfogadtatja az eddig el nem fogadott nyilatkozatokat, pótolhat hiányzó adatokat (a recepciós alkalmazással fotó készítése, igazolvány típus és szám beírása stb.). Beírhatja a hozzárendelt vendégkártya számát. A céges fogadó a vendég érkeztekor (belépési folyamat elején) a kliensén értesítést kap a vendég adataival. A beléptetés utolsó aktusa a recepciós kliens alkalmazásban a vendég aláírása. A beléptetési folyamat végén szintén jelzést kap erről.

A recepciós nem bejelentett vendéget is regisztrálhat látogatóként, ez esetben minden adatot az ő eszközén megadva, a cél céget és fogadó személyt a fotózást/nyilatkozatok elfogadását stb. teljesen végigvive.

Kilépéskor beállítás esetén szintén jeleznie kell a kliens alkalmazásban (időbélyeg).

A **vendég** a céges fogadó meghívására emailen kap értesítést a látogatás tervezett időpontjáról, a fogadó személyéről, a látogatáshoz rendelt szoba/tárgyaló számáról. (elmenthető naptárbejegyzés formájában is). Látja az elfogadandó globális és céges nyilatkozatokat, valamint el is fogadhatja azokat. Feltölthet magáról fotót, megadhat igazolványszámot és igazolvány típust, megadhatja az elvárt metaadatokat.

A vendégnek a látogatás előtt 1 órával emlékeztető érkezik a látogatás adataival.

A vendég egyszer már megadott adatai elmentődnek a következő látogatáshoz (email cím alapján), de a fenti folyamat szerint felülírhatóak (naplózva. Pl. mindig tudnunk kell, melyik igazolvánnyal azonosította magát). A rendszernek kezelnie kell, hogy esetlegesen pl. a vendégről tárolt adatok típusa módosul.
