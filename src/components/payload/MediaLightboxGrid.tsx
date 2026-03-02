'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { MediaFileLink } from '@/lib/view-helpers'

type MediaLightboxGridProps = {
  files: MediaFileLink[]
  hintText?: string
}

const isLikelyPDF = (file: MediaFileLink): boolean => {
  const filename = file.filename.toLowerCase()
  return filename.endsWith('.pdf') || !file.isImage
}

export const MediaLightboxGrid = ({ files, hintText }: MediaLightboxGridProps) => {
  const [activeFile, setActiveFile] = useState<MediaFileLink | null>(null)

  useEffect(() => {
    if (!activeFile) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveFile(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeFile])

  return (
    <>
      <div className="mv-media-grid">
        {files.map((file) => (
          <button
            className="mv-media-grid__button"
            key={`${file.url}-${file.filename}`}
            onClick={() => setActiveFile(file)}
            type="button"
          >
            <div className="mv-media-grid__item">
              {file.isImage ? (
                <Image alt={file.filename} height={140} loading="lazy" src={file.url} unoptimized width={220} />
              ) : (
                <div className="mv-media-grid__pdf">PDF</div>
              )}
              <p>{file.filename}</p>
            </div>
          </button>
        ))}
      </div>

      {hintText ? <p className="mv-media-grid__hint">{hintText}</p> : null}

      {activeFile ? (
        <div className="mv-lightbox" onClick={() => setActiveFile(null)} role="dialog">
          <div className="mv-lightbox__content" onClick={(event) => event.stopPropagation()}>
            <div className="mv-lightbox__head">
              <strong>{activeFile.filename}</strong>
              <button className="mv-lightbox__close" onClick={() => setActiveFile(null)} type="button">
                Zatvori
              </button>
            </div>

            <div className="mv-lightbox__body">
              {activeFile.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={activeFile.filename} src={activeFile.url} />
              ) : isLikelyPDF(activeFile) ? (
                <iframe src={activeFile.url} title={activeFile.filename} />
              ) : (
                <a className="mv-lightbox__download" download={activeFile.filename} href={activeFile.url}>
                  Preuzmi fajl
                </a>
              )}
            </div>

            <div className="mv-lightbox__actions">
              <a className="mv-lightbox__download" download={activeFile.filename} href={activeFile.url}>
                Preuzmi
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
