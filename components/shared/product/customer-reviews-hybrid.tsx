"use client";

import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
  variant: string;
}

interface CustomerReviewsHybridProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export function CustomerReviewsHybrid({ rating, reviewCount, reviews }: CustomerReviewsHybridProps) {
  return (
    <div className="mt-12 rounded-xl bg-muted/40 p-6">
      <h3 className="mb-6 text-lg font-bold text-foreground">Customer Reviews</h3>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        {/* Summary Column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-foreground text-2xl font-bold text-foreground">
              {rating}
            </div>
            <div>
              <div className="flex gap-0.5 text-rating mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-current" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <div className="font-bold text-foreground text-sm mb-0.5">95% of buyers are satisfied</div>
              <div className="text-xs text-muted-foreground">98 rating • {reviewCount} Reviews</div>
            </div>
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 w-8">
                  <Star className="h-3 w-3 fill-rating text-rating" />
                  <span className="font-medium text-muted-foreground">{star}</span>
                </div>
                <Progress value={star === 5 ? 80 : star === 4 ? 15 : 2} className="h-1.5 bg-muted [&>div]:bg-foreground" />
                <span className="w-8 text-right text-muted-foreground text-xs">
                  {star === 5 ? 136 : star === 4 ? 33 : star === 3 ? 9 : star === 2 ? 10 : 2}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Column */}
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="h-7 text-xs bg-foreground text-background hover:bg-foreground/90 rounded-full px-4 border-none shadow-none">All ({reviewCount})</Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs bg-background text-foreground hover:bg-muted rounded-full px-4 border-none shadow-none">Pic Review (12)</Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs bg-background text-foreground hover:bg-muted rounded-full px-4 border-none shadow-none">Fast Shipping (12)</Button>
            <Button variant="secondary" size="sm" className="h-7 text-xs bg-background text-foreground hover:bg-muted rounded-full px-4 border-none shadow-none">5 Stars (136)</Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.id} className="border-none shadow-none bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-rating gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{review.date}</span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-0.5">{review.author}</h4>
                  <div className="text-[10px] text-muted-foreground mb-3">{review.variant}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" /> {review.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <ThumbsDown className="h-3.5 w-3.5" /> {review.dislikes}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="h-9 px-6 border-border text-sm font-medium text-foreground hover:bg-muted rounded-full">See All Reviews</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
