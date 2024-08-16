import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class hinh_anh_tag extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    hinh_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hinh_anh',
        key: 'hinh_id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'tag_id'
      }
    }
  }, {
    sequelize,
    tableName: 'hinh_anh_tag',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hinh_id" },
          { name: "tag_id" },
        ]
      },
      {
        name: "tag_id",
        using: "BTREE",
        fields: [
          { name: "tag_id" },
        ]
      },
    ]
  });
  }
}
