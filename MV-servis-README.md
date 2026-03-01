# MV servis - specifikacija projekta

## 1. Pregled projekta

MV servis je privatna PWA web aplikacija namenjena jednom auto mehanicaru za interno vodjenje evidencije o:

- klijentima
- vozilima klijenata
- servisima i popravkama
- nabavci delova
- racunima i troskovima
- alatima i uredjajima u servisu
- slikama, racunima i drugoj dokumentaciji

Aplikacija je namenjena za svakodnevni rad na telefonu i racunaru. Ne postoji javni marketing sajt. Pocetna stranica aplikacije vodi direktno na prijavu. UI je iskljucivo na srpskom jeziku.

## 2. Glavni cilj

Napraviti jednostavnu, brzu i pouzdanu internu aplikaciju kroz koju korisnik moze:

1. da brzo pronadje klijenta ili vozilo
2. da vidi kompletnu istoriju servisa po vozilu
3. da evidentira svaki servis, kvar, mali ili veliki servis
4. da cuva slike, racune i propratnu dokumentaciju
5. da vodi osnovnu evidenciju o nabavci delova
6. da vodi popis alata i uredjaja u servisu
7. da koristi aplikaciju kao PWA na telefonu

## 3. Preporuceni tehnoloski stack

### Obavezni stack

- **Next.js 16** - osnovna aplikacija i server
- **Payload CMS 3** - admin panel, auth, schema, API i upravljanje podacima
- **PostgreSQL** - glavna baza
- **Railway** - deployment aplikacije i PostgreSQL baze
- **Payload upload storage** - za slike racuna, kvara, vozila i dokumentaciju
- **PWA konfiguracija** - manifest, installable app, offline fallback za osnovne staticke delove

### Zasto je ovo najbolji izbor

- jedan projekat umesto odvojenog frontenda i backenda
- Payload vec daje admin, auth, CRUD i API sloj
- lako se modeluju relacije klijent -> vise vozila -> vise servisa
- pogodno za privatnu poslovnu aplikaciju bez SEO zahteva
- lako se hostuje na Railway-u
- ti vec poznajes React, backend i Payload, pa je vreme izrade krace
- PWA omogucava instalaciju na telefonu bez izrade native aplikacije

## 4. Tehnicka arhitektura

### Arhitektura aplikacije

Jedna Next.js aplikacija sa integrisanim Payload-om.

Sastoji se iz:

- Payload admin dela za unos i administraciju podataka
- custom dashboard / custom views za brzi pregled i pretragu
- PostgreSQL baze
- upload kolekcije za fajlove i slike
- PWA sloja za telefon

### Tip korisnika

Za sada postoji samo jedan korisnik ili mali broj internih korisnika:

- vlasnik servisa
- eventualno pomocni radnik u buducnosti

Nije potreban javni portal za klijente.

## 5. Funkcionalni moduli

### 5.1 Klijenti

Za svakog klijenta cuvati:

- ime - obavezno
- prezime
- kontakt telefon - obavezno
- email
- adresa
- napomena

Klijent moze imati jedno ili vise vozila.

### 5.2 Vozila

Za svako vozilo cuvati:

- klijent - relacija, obavezno
- marka
- model - obavezno
- godiste
- registracija
- broj sasije - obavezno i jedinstveno
- motor
- gorivo
- kubikaza
- snaga
- boja
- trenutna kilometraza
- napomena
- slike vozila - opciono, vise slika

Jedan klijent moze imati vise vozila.

### 5.3 Servisi i popravke

Za svaki servis cuvati:

- vozilo - relacija, obavezno
- klijent - automatski povucen preko vozila ili relacija radi lakse pretrage
- tip servisa - obavezno
  - mali servis
  - veliki servis
  - popravka kvara
  - dijagnostika
  - limarija / ostalo
- datum - obavezno
- kilometraza - obavezno
- opis radova - obavezno
- ugradjeni delovi - lista stavki
- cena rada
- cena delova
- ukupna cena
- status naplate
  - placeno
  - nije placeno
  - delimisno placeno
- nacin placanja
- racun za delove - upload slike ili PDF, opciono
- slike kvara - vise slika, opciono
- slike nakon popravke - vise slika, opciono
- interna napomena

### 5.4 Stavke delova u okviru servisa

Svaki servis moze imati vise stavki delova:

- naziv dela
- proizvodjac / brend
- sifra dela
- kolicina
- nabavna cena
- prodajna cena
- dobavljac
- napomena

### 5.5 Nabavka delova

Posebna evidencija nabavke delova:

- datum nabavke
- dobavljac
- broj racuna
- ukupna cena
- slike racuna ili PDF
- lista kupljenih delova
- napomena

Svaka stavka nabavke moze imati:

- naziv dela
- sifra dela
- kolicina
- cena po komadu
- ukupno

Pozeljno je kasnije omoguciti povezivanje nabavljenih delova sa servisima, ali to nije obavezno za prvu verziju.

### 5.6 Alati i uredjaji

Voditi popis alata i uredjaja:

- naziv - obavezno
- kategorija
- opis
- serijski broj
- datum kupovine
- cena
- lokacija u servisu
- stanje
  - ispravno
  - na servisu
  - neispravno
  - rashodovano
- slike - vise slika
- napomena

### 5.7 Dokumenti i fajlovi

Sistem treba da podrzi upload i pregled:

- slika racuna
- PDF racuna
- slika kvara
- slika vozila
- slika alata
- ostalih dokumenata

## 6. Pretraga i UX zahtevi

Aplikacija mora da omoguci brzu pretragu po:

- imenu i prezimenu klijenta
- telefonu klijenta
- modelu vozila
- broju sasije
- registraciji
- tipu servisa
- datumu servisa

### Obavezni UX ciljevi

- mobilni prikaz je prioritet
- veoma brz unos podataka sa telefona
- sto manje klikova za unos servisa
- iz liste klijenata lako otvoriti vozila
- iz vozila lako otvoriti kompletnu istoriju servisa
- omoguciti filtere i sortiranje
- omoguciti prikaz poslednjih servisa na dashboard-u

## 7. PWA zahtevi

Aplikacija mora biti installable kao PWA i prilagodjena mobilnom radu.

### Obavezno

- web manifest
- ikonica aplikacije
- splash / install experience
- responsive layout
- login ekran prilagodjen telefonu
- touch-friendly forme i tabele
- osnovni offline fallback za shell aplikacije

Napomena: puna offline sinhronizacija nije obavezna za prvu verziju. Fokus je na installable PWA i brzom radu online.

## 8. Jezik i lokalizacija

- kompletan UI na srpskom jeziku
- podrazumevani format datuma prilagodjen lokalnom korisniku
- svi labele, validacije i poruke na srpskom
- nije potrebna visejezicnost u prvoj verziji

## 9. Bezbednost i pristup

- aplikacija je privatna
- pocetna ruta vodi na login
- ne postoji javni landing page
- ne optimizovati za SEO
- ograniciti pristup samo autentifikovanim korisnicima
- koristiti sigurne cookie sesije ili Payload auth mehanizam

## 10. Predlog kolekcija u Payload-u

### 10.1 Users

Za prijavu u sistem.

Polja:

- email
- password
- ime
- uloga

### 10.2 Clients

Polja:

- firstName - required
- lastName
- phone - required
- email
- address
- note

### 10.3 Vehicles

Polja:

- client - relationship to Clients, required
- brand
- model - required
- year
- registrationNumber
- vin - required, unique
- engine
- fuelType
- engineCapacity
- power
- color
- currentMileage
- note
- gallery - array of uploads

### 10.4 Services

Polja:

- vehicle - relationship to Vehicles, required
- clientSnapshotName - opciono za brzi prikaz
- serviceType - select, required
- serviceDate - required
- mileage - required
- description - textarea, required
- partsUsed - array
- laborPrice
- partsPrice
- totalPrice
- paymentStatus
- paymentMethod
- partsInvoiceFiles - array uploads
- issueImages - array uploads
- afterRepairImages - array uploads
- internalNote

### 10.5 PartPurchases

Polja:

- purchaseDate
- supplier
- invoiceNumber
- totalAmount
- invoiceFiles - array uploads
- items - array
- note

### 10.6 Tools

Polja:

- name - required
- category
- description
- serialNumber
- purchaseDate
- purchasePrice
- locationInWorkshop
- condition
- images - array uploads
- note

### 10.7 Media

Upload kolekcija za:

- slike
- PDF dokumenta
- racune

## 11. Administrativni i custom ekrani

Pored standardnog Payload admin-a, implementirati custom stranice:

### Dashboard

Prikaz:

- poslednji servisi
- broj klijenata
- broj vozila
- broj servisa u poslednjih 30 dana
- poslednje nabavke delova
- alati koji su oznaceni kao neispravni

### Brza pretraga

Jedna centralna pretraga koja pretrazuje:

- klijente
- vozila
- servise

### Vozilo detalj

Na jednoj stranici prikazati:

- osnovne podatke o vozilu
- vlasnika
- poslednju kilometrazu
- kompletnu istoriju servisa
- slike i dokumenta

## 12. Validacije

### Klijent

- ime obavezno
- telefon obavezan

### Vozilo

- model obavezan
- broj sasije obavezan
- broj sasije jedinstven

### Servis

- vozilo obavezno
- tip servisa obavezan
- datum obavezan
- kilometraza obavezna
- opis radova obavezan

## 13. Ne-funkcionalni zahtevi

- aplikacija mora biti brza na telefonu
- forma mora biti jednostavna za koriscenje jednom rukom
- upload slika mora biti jednostavan direktno sa telefona
- interfejs mora biti cist, minimalan i poslovan
- podaci moraju biti pregledni i laki za pronalazenje

## 14. Dizajn smernice

- moderan, jednostavan, profesionalan UI
- bez suvisnih animacija
- fokus na citljivost i brz unos
- vece touch mete za mobilni rad
- neutralne boje sa blagim industrijskim akcentima
- srpska latinica u interfejsu

## 15. Preporuka implementacije

### Faza 1 - MVP

Uraditi prvo:

- autentifikaciju
- klijente
- vozila
- servise
- upload slika i racuna
- pretragu
- responsive admin / dashboard
- PWA instalaciju

### Faza 2

Dodati:

- evidenciju nabavke delova
- popis alata i uredjaja
- napredne filtere
- izvestaje i exporte

### Faza 3

Opcionalno kasnije:

- podsetnici za sledeci servis
- SMS / email obavestenja
- detaljnija analitika
- zalihe delova
- vise korisnickih uloga

## 16. Predlog folder strukture

```txt
src/
  app/
    (payload)/
    admin/
    login/
    dashboard/
    clients/
    vehicles/
    services/
    purchases/
    tools/
  collections/
    Users.ts
    Clients.ts
    Vehicles.ts
    Services.ts
    PartPurchases.ts
    Tools.ts
    Media.ts
  components/
    ui/
    forms/
    search/
    dashboard/
  lib/
    auth/
    validation/
    formatters/
    queries/
  hooks/
  styles/
public/
  icons/
  manifest/
```

## 17. Tehnicki detalji koje treba implementirati

- Payload konfiguracija sa Postgres adapterom
- auth kolekcija Users
- access control: sve privatno, samo login korisnik
- Media upload kolekcija
- relacije izmedju klijenata, vozila i servisa
- custom dashboard view
- search optimizovan za kljucna polja
- manifest i PWA metadata
- responsive layout
- srpski prevodi u svim labelama i porukama

## 18. Sta nije potrebno

- javni sajt
- SEO optimizacija
- blog
- marketing stranice
- kompleksan multi-tenant sistem
- native mobile aplikacija

## 19. Zavrsni kriterijumi

Projekat se smatra uspesnim kada korisnik moze:

1. da se prijavi
2. da doda klijenta
3. da doda jedno ili vise vozila tom klijentu
4. da upise servis za vozilo
5. da uploaduje slike i racune
6. da brzo pretrazi klijenta, vozilo ili istoriju servisa
7. da koristi aplikaciju kao PWA na telefonu i na racunaru

## 20. Kratak zakljucak

Ovaj projekat treba izvesti kao jednu privatnu Next.js + Payload + PostgreSQL PWA aplikaciju. Fokus je na brzini izrade, jednostavnosti odrzavanja i prakticnoj upotrebi u realnom servisu.