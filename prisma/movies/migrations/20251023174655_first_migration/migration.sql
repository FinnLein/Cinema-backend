-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "bigPoster" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "actorsIds" TEXT[],
    "genresIds" TEXT[],
    "isSendTelegram" BOOLEAN DEFAULT false,
    "rating" DOUBLE PRECISION DEFAULT 4.0,
    "countOpened" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "movies"("title");
