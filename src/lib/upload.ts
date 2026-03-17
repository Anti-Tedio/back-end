import { writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'avatars')
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export async function saveAvatar(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type))throw new Error('Formato inválido. Use JPEG, PNG ou WebP.');

  if (file.size > MAX_SIZE_BYTES) throw new Error('Imagem muito grande. Máximo de 5MB.');

  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = extname(file.name) || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const filepath = join(UPLOAD_DIR, filename)

  const buffer = await file.arrayBuffer()
  await writeFile(filepath, Buffer.from(buffer))

  return `/avatars/${filename}`
}

export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    const filename = avatarUrl.replace('/avatars/', '')
    const filepath = join(UPLOAD_DIR, filename)
    await unlink(filepath)
  } catch {
  }
}