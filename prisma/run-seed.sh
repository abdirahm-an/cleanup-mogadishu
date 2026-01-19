#!/bin/bash
cd /home/abdi/projects/cleanup-mogadishu
sqlite3 dev.db < prisma/sql-seed.sql
echo "✅ Database seeded successfully!"
echo "📊 Summary:"
echo "   - 1 Country (Somalia)"
echo "   - 1 City (Mogadishu)"  
echo "   - 15 Districts"
echo "   - 75 Neighborhoods"