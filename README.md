# Song Soul Deals

หน้ารวมดีลซองการ์ด อุปกรณ์เล่นการ์ด และอุปกรณ์เกม จากช่อง [TikTok @songsoul44](https://www.tiktok.com/@songsoul44) และ [YouTube @songsoul_game](https://www.youtube.com/@songsoul_game)

ลิงก์ «ดูที่ Shopee» เป็นลิงก์พันธมิตรที่เจ้าของใส่เอง เว็บนี้ไม่ได้ดึงราคาสดจาก Shopee และไม่ได้เปิดช่องทางติดต่อส่วนตัว

ถ้ายังไม่ตั้งค่า Supabase เว็บยัง build และเปิดหน้าแรกได้ โดยแสดงสินค้าตัวอย่างจากไฟล์ `lib/sample-data.ts`

## สแตก

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth, Postgres, RLS)
- Vercel Analytics และ Speed Insights

## รันในเครื่อง

```bash
npm install
cp .env.example .env.local
npm run dev
```

เปิด http://localhost:3000

ยังไม่ใส่ค่าใน `.env.local` ก็ได้ หน้าแรกจะใช้สินค้าตัวอย่าง และหน้า `/admin` จะบอกว่ายังไม่ได้เชื่อมฐานข้อมูล

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## 1. สร้างโปรเจกต์ Supabase

1. เข้า [supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่บนแพลนฟรี
2. รอจนฐานข้อมูลพร้อม
3. ไปที่ Project Settings → API แล้วจดค่าเหล่านี้ไว้
   - Project URL
   - `anon` key (หรือ publishable key)
   - `service_role` key เก็บเป็นความลับ ใช้บนเซิร์ฟเวอร์เท่านั้น

## 2. รัน migration

ไฟล์อยู่ที่ `supabase/migrations/` สร้างตาราง `categories`, `products`, `clicks` พร้อม RLS และสินค้าตัวอย่าง 4 ชิ้น

วิธีที่ง่ายสุด: เปิด SQL Editor ในแดชบอร์ด วางเนื้อหาทั้งไฟล์ แล้วกด Run

หรือใช้ CLI หลังจาก `supabase link` กับโปรเจกต์แล้ว:

```bash
npx supabase db push
```

สิ่งที่นโยบายทำ:

- คนทั่วไปอ่านหมวดได้ทั้งหมด และอ่านได้เฉพาะสินค้าที่ `published = true`
- เขียน แก้ ลบสินค้าได้เฉพาะผู้ใช้ที่ล็อกอินและอีเมลอยู่ในตาราง `admin_allowlist`
- ไม่มีนโยบายให้คนทั่วไปแทรกแถวคลิก การนับคลิกทำบนเซิร์ฟเวอร์ด้วย service role
- อีเมลผู้ดูแลถูกเขียนลง `admin_allowlist` อัตโนมัติเมื่อเข้า `/admin` สำเร็จ จึงต้องมี `SUPABASE_SERVICE_ROLE_KEY`

## 3. ตั้งค่า Auth

1. ไปที่ Authentication → Providers แล้วเปิด Email
2. ไปที่ Authentication → Users → Add user
3. ใส่อีเมลและรหัสผ่านของผู้ดูแล แล้วเลือกยืนยันอีเมลอัตโนมัติ
4. แนะนำให้ปิด Allow new users to sign up หลังสร้างผู้ดูแลแล้ว เพื่อไม่ให้คนอื่นสมัครเอง
5. ไปที่ Authentication → URL Configuration
   - Site URL: `https://songsoul-deals.vercel.app`
   - Redirect URLs เพิ่มทั้งสองบรรทัด
     - `https://songsoul-deals.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`

## 4. ตัวแปรสภาพแวดล้อม

คัดลอกจาก `.env.example` ห้าม commit ค่าจริง

| ตัวแปร | ใช้ทำอะไร |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ที่อยู่โปรเจกต์ Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | คีย์สาธารณะสำหรับเบราว์เซอร์และหน้าร้าน |
| `SUPABASE_SERVICE_ROLE_KEY` | บันทึกคลิก และลงทะเบียนอีเมลผู้ดูแล ห้ามใส่ในตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` |
| `ADMIN_EMAILS` | อีเมลผู้ดูแล คั่นด้วยจุลภาค เช่น `you@example.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://songsoul-deals.vercel.app` ไม่ต้องมี `/` ท้าย |

บน Vercel: Project → Settings → Environment Variables ใส่ทั้ง 5 ค่าให้ Environment เป็น Production (และ Preview ถ้าต้องการ) แล้ว redeploy

ชื่อโปรเจกต์บน Vercel ควรเป็น `songsoul-deals` เพื่อให้โดเมนเป็น `songsoul-deals.vercel.app`

## 5. เพิ่มสินค้าผ่าน /admin

1. เปิด `/admin`
2. ใส่อีเมล แล้วเลือกอย่างใดอย่างหนึ่ง
   - กรอกรหัสผ่านแล้วกด «เข้าสู่ระบบ»
   - หรือกด «ส่งลิงก์ทางอีเมล» แล้วเปิดลิงก์จากจดหมาย ระบบจะพากลับมาที่ `/admin`
3. ถ้าอีเมลไม่อยู่ใน `ADMIN_EMAILS` จะเข้าได้แต่แก้สินค้าไม่ได้
4. ครั้งแรกที่เข้าได้ ระบบบันทึกอีเมลลง `admin_allowlist` จากนั้นฟอร์มจึงบันทึกได้
5. ในกล่อง «เพิ่มสินค้า» กรอก
   - ชื่อ
   - หมวด (แก้ชื่อหมวดได้ในตาราง `categories` ถ้าต้องการ)
   - ราคาโดยประมาณ เว้นว่างได้
   - คำรีวิวสั้นจากประสบการณ์จริง ไม่ต้องใส่ถ้ายังไม่มี
   - ลิงก์รูป เป็น `https://...` หรือไฟล์ในเว็บที่ขึ้นต้นด้วย `/`
   - ลิงก์ Shopee Affiliate ที่สร้างเอง ต้องขึ้นต้นด้วย `https://`
   - ลำดับในหมวด
   - ติ๊ก «แสดงบนหน้าร้าน» เมื่อพร้อมให้คนเห็น ถ้าไม่ติ๊ก สินค้าจะถูกซ่อน
6. กด «บันทึกสินค้าใหม่»
7. เปิดหน้าแรกแล้วตรวจการ์ด ปุ่ม «ดูที่ Shopee» พาไปที่ `/go/[id]` ซึ่งบันทึกคลิกแล้วจึงเปลี่ยนทางไปร้าน
8. กลับมาที่ `/admin` จะเห็นยอดคลิกของเดือนนี้ (ตามเวลาประเทศไทย) และยอดทั้งหมด
9. กด «แก้ไข» เพื่อเปลี่ยนข้อมูลหรือเอาติ๊กออกเพื่อซ่อน กด «ลบสินค้า» เมื่อไม่ใช้แล้ว

สินค้าตัวอย่าง 4 ชิ้นลิงก์ไปที่ https://shopee.co.th และไม่มีราคาจริง เมื่อจะลงของจริง ให้ลบตัวอย่าง หรือเอาติ๊ก «สินค้าตัวอย่าง» ออกก่อนใส่ราคาและรีวิวจริง ระบบไม่ให้บันทึกราคาบนแถวที่ยังติ๊กว่าเป็นตัวอย่าง

## การนับคลิก

ปุ่มบนการ์ดเปิด `/go/[id]` ในแท็บใหม่ เซิร์ฟเวอร์ตรวจว่าสินค้าถูกเผยแพร่และลิงก์เป็น https แล้วจึงบันทึกลงตาราง `clicks` ไม่เก็บไอพีหรือข้อมูลผู้ใช้ ถ้ายังไม่มี service role ผู้ใช้ยังถูกพาไปร้านได้ แต่ยอดคลิกจะไม่เพิ่ม

## สิ่งที่ตั้งใจไม่ทำ

- ไม่มีไลน์หรือข้อมูลติดต่อส่วนตัว
- ไม่ดึง Shopee Open API ในเวอร์ชันนี้ เว็บนี้เป็นหน้าร้านสำหรับใช้ยื่นขอคีย์ภายหลัง
- สินค้าตัวอย่างไม่มีราคาและไม่มีรีวิวที่แต่งให้ดูเหมือนของจริง
