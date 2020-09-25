# Adatbázis séma

## Address

A lakcímeket reprezentáló entitás. Az ország, város, ir.sz., utca, házszám adatokat tartalmazza. Kizárólag az irodaház, cég, illetve vendég entitások rendelkezhetnek lakcímmel. Egy lakcím tartozhat több entitáshoz is, sőt előfordulhat olyan eset is, hogy egy irodaház és egy cég ugyanazzal a lakcímmel rendelkezik.

## Company

A cégeket reprezentáló entitás. Cégek irodaházhoz, vagy vendéghez kötöttek, utóbbi esetben csak extra információként szolgálnak. Amennyiben egy cég irodaházhoz tartozik, abban az esetben tartalmazhat céges admint, alkalmazottakat, illetve lokális nyilatkozatokat is. Minden céghez tartozik egy regisztrációs konfiguráció, amely tartalmazza, hogy miket kell tárolni egy vendégről. Támogatott művelet a soft-delete.

## CompanyRegisterConfig

A cégen belüli, vendégekről tárolt információk beállításait reprezentáló entitás. Minden céghez tartozik egy ilyen beállítás. Ide tartoznak az olyan információ beállítások, mint nemzetiség, lakcím, mobilszám, születési hely, születési idő, anyja neve, céges adatok, szükséges-e vendégkártyát regisztrálni, illetve szükséges-e eltárolni a pontos kilépés időpontját. Alapértelmezetten minden érték false, vagyis nem követeljük meg az információ tárolását.

## ConsentForm

A nyilatkozatokat reprezentáló entitás. Egy nyilatkozat lehet globális, vagy lokális, tehát irodaházhoz, vagy céghez kötött. A nyilatkozatok verziózottak, így ezt az információt is eltároljuk.

## ConsentFormVersion

A nyilatkozat verziókat reprezentáló entitás. Több verzió is tartozhat egy nyilatkozathoz, illetve a verziók tartalmazzák a nyilatkozatok aktuális tartalmát. Ez azért fontos, mert naplóznunk kell, hogy egy vendégre milyen szabályok vonatkoztak adott időpontban.

## Guest

A vendégeket reprezentáló entitás. A vendégekhez mindig tartozik egy felhasználó, amely főként authentikációs információk miatt fontos. A vendégek látogatásokhoz tartoznak, illetve nyilatkozat verziókhoz kötöttek olyan értelemben, hogy nyilván kell tartani a vendég által elfogadott nyilatkozat verziókat. A vendégeknél továbbá tárolásra kerül a recepciós személye is, aki a beléptetési folyamatot végezte.

## GuestCard

A vendégekhez tartozó belépőkártyákat reprezentáló entitás.

## GuestConsentFormsAcceptance

Kapcsoló tábla, amely arra szolgál, hogy eltároljuk a vendég által elfogadandó nyilatkozatok állapotát, tehát a vendég elfogadta-e már az adott nyilatkozatot, vagy sem.

## OfficeBuilding

Az irodaházakat reprezentáló entitás. Az irodaházakhoz admint, cégeket, illetve globális nyilatkozatokat kapcsolhatunk. Támogatott művelet a soft-delete.

## User

A rendszerben szereplő felhasználót reprezentáló entitás. A felhasználó authentikációs és adminisztratív információkat tartalmaz.

## UserPermission

A felhasználókhoz köthető jogosultságokat reprezentáló entitás. Meghatározzák, hogy milyen műveleteket végezhetnek el a felhasználók. Több szerepkörhöz is kapcsolódhatnak.

## UserRole

A felhasználókhoz köthető szerepköröket reprezentáló entitás. Az egyes szerepkörökhöz különböző jogosultságok köthetők, melyek között lehetnek átmenetek olyan értelemben, hogy több szerepkör is rendelkezhet ugyanazzal a jogosultsággal.

## UserRolePermissions

Kapcsoló tábla, amely arra szolgál, hogy eltároljuk azt az információt, hogy egy szerepkörhöz milyen jogosultságok tartoznak.

## Visit

A látogatásokat és meghívásokat egyaránt reprezentáló entitás. Tartalmazza a meghívott vendégeket, az elfogadandó nyilatkozat verziókat, illetve a céges fogadó személyt is.

## VisitParticipation

Kapcsoló tábla, amely arra szolgál, hogy eltároljuk a vendég látogatáshoz tartozó részvételi információját.

## VisitConsentFormsLog

Kapcsoló tábla, amely arra szolgál, hogy eltároljuk azt az információt, hogy egy vendégnek milyen nyilatkozatokat milyen verzióval kell elfogadnia egy adott látogatás előtt el.
