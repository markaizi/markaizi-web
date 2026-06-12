-- CreateTable
CREATE TABLE "NoteRead" (
    "userId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteRead_pkey" PRIMARY KEY ("userId","noteId")
);

-- AddForeignKey
ALTER TABLE "NoteRead" ADD CONSTRAINT "NoteRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteRead" ADD CONSTRAINT "NoteRead_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
