# Wypożyczalnia filmów

Bardzo prosty projekt Node.js pomagający śledzić wypożyczanie filmów na lekcji. Kod jest pisany możliwie prosto, żeby wyglądał jak pierwsze podejście do Expressa.

## Funkcjonalności

- Widoki EJS (minimum 5) z prostą nawigacją.
- CRUD na filmach: dodawanie, podgląd, edycja, kasowanie.
- Filtrowanie i sortowanie listy filmów (`title` lub `year`, kierunek `asc/desc`).
- Obsługa wypożyczeń: nowe wypożyczenie, oznaczenie zwrotu, automatyczna aktualizacja stanu magazynu.
- Prosta lista kont użytkowników z hashowaniem haseł (bcrypt).
- Walidacja formularzy (express-validator) i obsługa błędów HTTP.

## Instalacja i uruchomienie

1. Skopiuj repozytorium i zainstaluj zależności:
   ```bash
   npm install
   ```
2. Skopiuj plik `.env.example` do `.env` i uzupełnij według potrzeb (domyślnie lokalny MongoDB):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/film_rental
   ```
3. (Opcjonalnie) uruchom bazę przez Dockera – instrukcja w `docker.txt`.
4. Wstaw przykładowe dane:
   ```bash
   npm run seed
   ```
5. Start trybu developerskiego:
   ```bash
   npm run dev
   ```
   Produkcyjnie można użyć `npm start`.

## Endpointy

| Metoda | Ścieżka | Opis |
| --- | --- | --- |
| GET | `/` | Strona startowa |
| GET | `/movies` | Lista filmów z filtrami `search`, `genre`, `sort`, `order` |
| GET | `/movies/new` | Formularz dodawania filmu |
| POST | `/movies` | Dodawanie filmu |
| GET | `/movies/:id` | Szczegóły filmu |
| GET | `/movies/:id/edit` | Formularz edycji |
| POST | `/movies/:id/update` | Aktualizacja filmu |
| POST | `/movies/:id/delete` | Usuwanie filmu |
| GET | `/rentals` | Lista wypożyczeń |
| GET | `/rentals/new` | Nowe wypożyczenie |
| POST | `/rentals` | Utworzenie wypożyczenia |
| POST | `/rentals/:id/finish` | Oznaczenie zwrotu |
| GET | `/users` | Lista kont |
| GET | `/users/new` | Formularz dodawania konta |
| POST | `/users` | Tworzenie użytkownika |

## Technologie

- Node.js + Express 5
- EJS + proste CSS
- MongoDB + Mongoose
- express-validator, bcryptjs, dotenv, morgan
- Docker (MongoDB w kontenerze)

## Autorzy

- Student (zadanie zaliczeniowe)

## Licencja

Projekt jest na licencji MIT (plik `LICENSE`).
