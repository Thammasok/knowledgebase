import { toast } from 'sonner'

export const onCopyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.info('Copied to clipboard')
    })
    .catch(() => {
      toast.error('Failed to copy', {
        description: text,
      })
    })
}
