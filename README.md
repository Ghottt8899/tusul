# DIPLOM — Программ хангамж хөгжүүлэлтийн процесс

Энэ бол миний **Программ хангамж хөгжүүлэлтийн процесс** хичээлийн
анхны лабораторийн ажил бөгөөд Express + TypeScript + MongoDB ашигласан
вэб аппликейшний backend төсөл юм.

---

## ⚙️ Ажиллуулах заавар

Төслийг хөгжүүлэлтийн орчинд ажиллуулахад дараах командуудыг ашиглана:

```bash
npm install
npm run dev


- CI: `.github/workflows/ci.yml`
- Coverage босго: 80% (Jest coverageThreshold)
- Командууд:
  - `npm run typecheck`
  - `npm run test` / `npm run coverage`
  - `npm run test:ci` (CI орчинд)


  ## Лаб 7 — Unit Test with Mocking & Stubbing
- `jest.mock`, `jest.spyOn`, `mockResolvedValue` ашиглав.
- Controller болон service хоорондын хамаарлыг тусгаарлан туршсан.
- Жишээ: Auth controller дээр fake security layer ашигласан.
