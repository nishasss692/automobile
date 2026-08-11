from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import Part
from app.schemas import PartResponse
from app.api.fitment_check import MOCK_PARTS_DB

router = APIRouter(prefix="/catalog", tags=["Parts Catalog"])

@router.get("", response_model=List[PartResponse])
def get_parts_catalog(
    category: Optional[str] = Query(None, description="Filter by part category"),
    search: Optional[str] = Query(None, description="Search term in name or brand"),
    db: Session = Depends(get_db)
):
    parts = db.query(Part).all()
    if not parts:
        parts = list(MOCK_PARTS_DB.values())

    result = []
    for p in parts:
        if category and p.category.lower() != category.lower():
            continue
        if search:
            q = search.lower()
            if q not in p.name.lower() and q not in p.brand.lower() and q not in p.sku.lower():
                continue
        result.append(PartResponse.model_validate(p))

    return result
